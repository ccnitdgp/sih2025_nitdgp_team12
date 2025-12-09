import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI(title="Health Dashboard API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_health_dashboard(workers_csv, medical_csv):
    # -----------------------------
    # Load datasets
    # -----------------------------
    workers = pd.read_csv(workers_csv)
    medical = pd.read_csv(medical_csv)

    # Merge data on health_id
    data = pd.merge(
        medical,
        workers[['health_id', 'current_city']],
        on='health_id',
        how='left'
    )

    # -----------------------------
    # Workers Monitored
    # -----------------------------
    workers_monitored = workers.groupby('current_city')['health_id'].nunique()

    # -----------------------------
    # Top Disease and its %
    # -----------------------------
    def get_top_disease(group):
        counts = group['diagnosis'].value_counts()
        top = counts.idxmax()
        percent = round((counts.max() / len(group)) * 100, 2)
        return pd.Series([top, percent], index=['Top Disease Name', 'Top Disease %'])

    top_disease = data.groupby('current_city').apply(get_top_disease)

    # -----------------------------
    # Prepare dashboard dataframe
    # -----------------------------
    dashboard = pd.DataFrame({
        'Workers Monitored': workers_monitored
    }).join(top_disease)

    dashboard = dashboard.fillna(0)

    # Sort by Workers Monitored (most active district first)
    dashboard = dashboard.sort_values(by='Workers Monitored', ascending=False)

    return dashboard.reset_index().rename(columns={'current_city': 'District'})

@app.get("/dashboard")
def get_dashboard(workers_csv: str = "workers_realworld_kerala.csv", medical_csv: str = "medical1.csv"):
    """Return the health dashboard as JSON."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    workers_path = workers_csv if os.path.isabs(workers_csv) else os.path.join(base_dir, workers_csv)
    medical_path = medical_csv if os.path.isabs(medical_csv) else os.path.join(base_dir, medical_csv)

    if not os.path.exists(workers_path):
        return JSONResponse(status_code=400, content={"error": f"Workers file not found: {workers_path}"})
    if not os.path.exists(medical_path):
        return JSONResponse(status_code=400, content={"error": f"Medical file not found: {medical_path}"})

    try:
        df = generate_health_dashboard(workers_path, medical_path)
        # Only send backend-generated fields
        fields_to_send = ['District', 'Workers Monitored', 'Top Disease Name', 'Top Disease %']
        return JSONResponse(content={"data": df[fields_to_send].to_dict(orient="records")})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
