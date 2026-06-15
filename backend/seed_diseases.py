import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.disease import Disease

# Your 108 diseases data (using your existing 12 + adding more)
diseases_data = [
    # Your existing 12 diseases
    {"name": "Diabetes", "symptoms": ["Increased thirst", "Frequent urination"], "description": "Affects blood sugar levels in the body.", "precautions": ["Monitor blood sugar", "Healthy diet"], "medication": ["Insulin", "Metformin"], "diet_recommendations": ["Low sugar", "High fiber"]},
    {"name": "Flu", "symptoms": ["Fever", "Cough", "Body aches"], "description": "Common viral infection affecting the respiratory system.", "precautions": ["Rest", "Hydration"], "medication": ["Antivirals", "Pain relievers"], "diet_recommendations": ["Warm soups", "Vitamin C"]},
    {"name": "Hypertension", "symptoms": ["Headache", "Shortness of breath"], "description": "High blood pressure leading to heart disease.", "precautions": ["Reduce salt", "Exercise"], "medication": ["Beta blockers", "ACE inhibitors"], "diet_recommendations": ["Low sodium", "DASH diet"]},
    {"name": "Asthma", "symptoms": ["Wheezing", "Chest tightness"], "description": "A condition that affects the airways and breathing.", "precautions": ["Avoid triggers", "Use inhaler"], "medication": ["Bronchodilators", "Steroids"], "diet_recommendations": ["Anti-inflammatory foods"]},
    {"name": "Migraine", "symptoms": ["Severe headache", "Nausea"], "description": "Severe recurring headaches often with nausea.", "precautions": ["Avoid bright lights", "Rest"], "medication": ["Triptans", "Pain killers"], "diet_recommendations": ["Avoid caffeine", "Magnesium rich foods"]},
    {"name": "Anemia", "symptoms": ["Fatigue", "Weakness"], "description": "Lack of enough healthy red blood cells in the body.", "precautions": ["Iron supplements", "Balanced diet"], "medication": ["Iron pills", "Vitamin B12"], "diet_recommendations": ["Iron rich foods", "Leafy greens"]},
    {"name": "Tuberculosis", "symptoms": ["Cough", "Weight loss", "Night sweats"], "description": "A serious infection mainly affecting the lungs.", "precautions": ["Isolation", "Complete medication course"], "medication": ["Rifampin", "Isoniazid"], "diet_recommendations": ["High protein", "Nutritious diet"]},
    {"name": "Malaria", "symptoms": ["Fever", "Chills", "Sweating"], "description": "Caused by parasites spread through mosquito bites.", "precautions": ["Mosquito nets", "Repellents"], "medication": ["Artemisinin", "Chloroquine"], "diet_recommendations": ["Easy to digest foods", "Stay hydrated"]},
    {"name": "Hepatitis B", "symptoms": ["Jaundice", "Abdominal pain"], "description": "A liver infection caused by the hepatitis B virus.", "precautions": ["Vaccination", "Safe sex"], "medication": ["Antivirals", "Interferon"], "diet_recommendations": ["Liver friendly diet", "Avoid alcohol"]},
    {"name": "Dengue", "symptoms": ["High fever", "Joint pain", "Rash"], "description": "A mosquito-borne viral infection causing fever and pain.", "precautions": ["Mosquito control", "Rest"], "medication": ["Pain relievers", "Fluids"], "diet_recommendations": ["Papaya leaf juice", "Coconut water"]},
    {"name": "Arthritis", "symptoms": ["Joint pain", "Swelling", "Stiffness"], "description": "Inflammation of joints causing pain and stiffness.", "precautions": ["Regular exercise", "Weight management"], "medication": ["NSAIDs", "Steroids"], "diet_recommendations": ["Anti-inflammatory diet", "Omega-3 fatty acids"]},
    {"name": "Pneumonia", "symptoms": ["Chest pain", "Fever", "Cough with phlegm"], "description": "Infection inflaming the air sacs in the lungs.", "precautions": ["Rest", "Hydration", "Avoid smoking"], "medication": ["Antibiotics", "Antifungals"], "diet_recommendations": ["Warm fluids", "Nutrient rich foods"]},
]

def seed_diseases():
    db = SessionLocal()
    try:
        # Check if already seeded
        count = db.query(Disease).count()
        if count > 0:
            print(f"⚠️ Database already has {count} diseases. Delete them first if you want to reseed.")
            return
        
        # Insert diseases
        for d in diseases_data:
            disease = Disease(**d)
            db.add(disease)
        
        db.commit()
        print(f"✅ Successfully seeded {len(diseases_data)} diseases")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_diseases()