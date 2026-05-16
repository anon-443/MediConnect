import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const diseaseDetails: { [key: number]: any } = {
  1: { name: 'Heart Disease', category: 'Cardiovascular', description: 'A range of conditions affecting the heart including coronary artery disease and heart failure.', symptoms: ['Chest pain or discomfort', 'Shortness of breath', 'Pain in neck jaw or throat', 'Fatigue and weakness', 'Irregular heartbeat', 'Swelling in legs or feet'], causes: ['High blood pressure', 'High cholesterol', 'Smoking', 'Diabetes', 'Obesity', 'Unhealthy diet', 'Physical inactivity'], treatment: ['Blood thinners and beta blockers', 'Lifestyle changes including diet and exercise', 'Bypass surgery or angioplasty', 'Cardiac rehabilitation programs'], prevention: ['Maintain healthy blood pressure', 'Exercise regularly', 'Eat a heart healthy diet', 'Avoid smoking and alcohol', 'Manage stress', 'Regular health checkups'] },
  2: { name: 'Hypertension', category: 'Cardiovascular', description: 'A condition where blood pressure in the arteries is persistently elevated.', symptoms: ['Headaches', 'Shortness of breath', 'Nosebleeds', 'Dizziness', 'Chest pain', 'Visual changes', 'Often no symptoms at all'], causes: ['Obesity', 'Physical inactivity', 'High salt diet', 'Excessive alcohol', 'Stress', 'Genetics', 'Age'], treatment: ['Antihypertensive medications', 'Diuretics', 'ACE inhibitors', 'Lifestyle modifications', 'Low sodium diet'], prevention: ['Reduce salt intake', 'Exercise daily', 'Maintain healthy weight', 'Limit alcohol consumption', 'Manage stress levels'] },
  3: { name: 'Stroke', category: 'Cardiovascular', description: 'Occurs when blood supply to part of the brain is cut off causing brain damage.', symptoms: ['Sudden numbness in face arm or leg', 'Confusion or trouble speaking', 'Vision problems', 'Severe headache', 'Difficulty walking or loss of balance'], causes: ['High blood pressure', 'Heart disease', 'Diabetes', 'Smoking', 'High cholesterol', 'Obesity'], treatment: ['Clot busting medications', 'Surgery to remove clot', 'Blood pressure control', 'Rehabilitation therapy', 'Speech and physical therapy'], prevention: ['Control blood pressure', 'Quit smoking', 'Exercise regularly', 'Healthy diet', 'Control diabetes'] },
  4: { name: 'Atrial Fibrillation', category: 'Cardiovascular', description: 'An irregular and often rapid heart rate that can increase risk of stroke.', symptoms: ['Heart palpitations', 'Fatigue', 'Shortness of breath', 'Dizziness', 'Chest discomfort', 'Weakness'], causes: ['High blood pressure', 'Heart disease', 'Thyroid problems', 'Sleep apnea', 'Alcohol consumption', 'Age'], treatment: ['Blood thinners to prevent stroke', 'Rate control medications', 'Rhythm control medications', 'Cardioversion', 'Catheter ablation'], prevention: ['Control blood pressure', 'Maintain healthy weight', 'Avoid excessive alcohol', 'Treat sleep apnea', 'Regular heart checkups'] },
  5: { name: 'Heart Failure', category: 'Cardiovascular', description: 'A condition where the heart cannot pump enough blood to meet the body needs.', symptoms: ['Shortness of breath', 'Fatigue', 'Swelling in legs ankles and feet', 'Rapid heartbeat', 'Reduced ability to exercise', 'Persistent cough'], causes: ['Coronary artery disease', 'High blood pressure', 'Heart attack history', 'Diabetes', 'Obesity', 'Kidney disease'], treatment: ['ACE inhibitors', 'Beta blockers', 'Diuretics', 'Heart transplant in severe cases', 'Implantable devices'], prevention: ['Healthy diet low in sodium', 'Regular exercise', 'Quit smoking', 'Control blood pressure and diabetes', 'Limit alcohol'] },
  6: { name: 'Coronary Artery Disease', category: 'Cardiovascular', description: 'Narrowing of coronary arteries due to plaque buildup reducing blood flow to the heart.', symptoms: ['Chest pain angina', 'Shortness of breath', 'Heart attack', 'Fatigue', 'Weakness'], causes: ['Plaque buildup in arteries', 'High cholesterol', 'Smoking', 'High blood pressure', 'Diabetes', 'Age'], treatment: ['Lifestyle changes', 'Medications for cholesterol and blood pressure', 'Angioplasty and stenting', 'Bypass surgery'], prevention: ['Quit smoking', 'Healthy diet', 'Regular exercise', 'Control cholesterol and blood pressure', 'Maintain healthy weight'] },
  7: { name: 'Asthma', category: 'Respiratory', description: 'A condition in which airways narrow and swell producing extra mucus making breathing difficult.', symptoms: ['Shortness of breath', 'Chest tightness', 'Wheezing', 'Coughing especially at night', 'Trouble sleeping due to coughing'], causes: ['Airborne allergens like pollen', 'Respiratory infections', 'Physical activity', 'Cold air', 'Air pollutants', 'Certain medications'], treatment: ['Inhaled corticosteroids', 'Short acting beta agonists', 'Long acting beta agonists', 'Allergy medications', 'Bronchial thermoplasty'], prevention: ['Identify and avoid triggers', 'Get vaccinated for flu', 'Monitor breathing', 'Use air purifiers', 'Follow asthma action plan'] },
  8: { name: 'COPD', category: 'Respiratory', description: 'Chronic obstructive pulmonary disease causes obstructed airflow from the lungs.', symptoms: ['Shortness of breath', 'Chronic cough with mucus', 'Wheezing', 'Chest tightness', 'Frequent respiratory infections', 'Fatigue'], causes: ['Smoking is main cause', 'Long term exposure to air pollutants', 'Genetic factors', 'Occupational dust and chemicals'], treatment: ['Bronchodilators', 'Inhaled steroids', 'Combination inhalers', 'Oxygen therapy', 'Pulmonary rehabilitation', 'Surgery in severe cases'], prevention: ['Quit smoking', 'Avoid air pollutants', 'Use protective equipment at work', 'Get vaccinated', 'Regular exercise'] },
  9: { name: 'Pneumonia', category: 'Respiratory', description: 'An infection that inflames air sacs in one or both lungs which may fill with fluid.', symptoms: ['Chest pain when breathing', 'Cough with phlegm', 'Fever chills and sweating', 'Shortness of breath', 'Fatigue', 'Nausea and vomiting'], causes: ['Bacteria especially Streptococcus pneumoniae', 'Viruses including flu and COVID', 'Fungi', 'Aspiration of food or liquid'], treatment: ['Antibiotics for bacterial pneumonia', 'Antiviral medications', 'Fever reducers', 'Cough medicine', 'Hospitalization for severe cases'], prevention: ['Get vaccinated', 'Practice good hygiene', 'Quit smoking', 'Maintain strong immune system', 'Wash hands frequently'] },
  10: { name: 'Bronchitis', category: 'Respiratory', description: 'Inflammation of the lining of bronchial tubes which carry air to and from the lungs.', symptoms: ['Cough with mucus', 'Shortness of breath', 'Slight fever', 'Chest discomfort', 'Fatigue', 'Wheezing'], causes: ['Viruses same as cold and flu', 'Bacteria in some cases', 'Smoking', 'Air pollution', 'Dust and fumes'], treatment: ['Rest and fluids', 'Cough suppressants', 'Bronchodilators', 'Antibiotics only if bacterial', 'Humidifier use'], prevention: ['Quit smoking', 'Avoid lung irritants', 'Get flu vaccine', 'Wash hands regularly', 'Wear mask in polluted areas'] },
  11: { name: 'Tuberculosis', category: 'Respiratory', description: 'A potentially serious infectious bacterial disease that mainly affects the lungs.', symptoms: ['Persistent cough lasting 3 weeks or more', 'Coughing up blood', 'Chest pain', 'Fatigue', 'Fever', 'Night sweats', 'Weight loss'], causes: ['Mycobacterium tuberculosis bacteria', 'Airborne transmission through coughing', 'Weakened immune system', 'HIV infection', 'Overcrowding'], treatment: ['6 to 9 months of antibiotics', 'Isoniazid rifampin ethambutol', 'Directly observed therapy', 'Hospitalization in severe cases'], prevention: ['BCG vaccine', 'Good ventilation', 'Avoid close contact with infected persons', 'Early diagnosis and treatment', 'Strengthen immune system'] },
  12: { name: 'Influenza', category: 'Respiratory', description: 'A contagious respiratory illness caused by influenza viruses affecting nose throat and lungs.', symptoms: ['Fever and chills', 'Cough', 'Sore throat', 'Runny nose', 'Muscle aches', 'Headaches', 'Fatigue', 'Vomiting in children'], causes: ['Influenza A B or C viruses', 'Spread through droplets when coughing or sneezing', 'Touching contaminated surfaces'], treatment: ['Rest and fluids', 'Antiviral medications oseltamivir', 'Fever reducers', 'Hospitalization for severe cases'], prevention: ['Annual flu vaccine', 'Wash hands frequently', 'Avoid close contact with sick people', 'Cover mouth when coughing', 'Stay home when sick'] },
  13: { name: 'COVID-19', category: 'Respiratory', description: 'An infectious disease caused by the SARS-CoV-2 virus causing respiratory illness.', symptoms: ['Fever or chills', 'Cough', 'Shortness of breath', 'Fatigue', 'Muscle aches', 'Loss of taste or smell', 'Sore throat'], causes: ['SARS-CoV-2 virus', 'Close contact with infected person', 'Respiratory droplets', 'Touching contaminated surfaces'], treatment: ['Rest and hydration', 'Antiviral medications', 'Oxygen therapy for severe cases', 'Hospitalization if necessary', 'Supportive care'], prevention: ['Get vaccinated', 'Wear mask in crowded places', 'Wash hands frequently', 'Maintain social distancing', 'Ventilate indoor spaces'] },
  14: { name: 'Sinusitis', category: 'Respiratory', description: 'Inflammation of the sinuses causing nasal congestion pain and pressure.', symptoms: ['Nasal congestion', 'Thick nasal discharge', 'Pain and pressure around face', 'Headache', 'Reduced sense of smell', 'Cough', 'Fatigue'], causes: ['Viral infections like common cold', 'Bacterial infection', 'Allergies', 'Nasal polyps', 'Deviated nasal septum'], treatment: ['Nasal saline rinse', 'Decongestants', 'Nasal corticosteroid sprays', 'Antibiotics if bacterial', 'Surgery in chronic cases'], prevention: ['Stay hydrated', 'Use humidifier', 'Avoid allergens', 'Practice good hygiene', 'Treat allergies promptly'] },
  15: { name: 'Whooping Cough', category: 'Respiratory', description: 'A highly contagious bacterial respiratory tract infection causing severe coughing fits.', symptoms: ['Severe coughing fits', 'High pitched whooping sound when inhaling', 'Vomiting after coughing', 'Exhaustion after coughing', 'Runny nose initially'], causes: ['Bordetella pertussis bacteria', 'Spread through respiratory droplets', 'Direct contact with infected person'], treatment: ['Antibiotics erythromycin or azithromycin', 'Hospitalization for infants', 'Supportive care', 'Rest and fluids'], prevention: ['DTaP vaccine for children', 'Tdap booster for adults', 'Avoid contact with infected persons', 'Cover mouth when coughing'] },
  16: { name: 'Dengue Fever', category: 'Viral', description: 'A mosquito-borne viral infection causing high fever severe headache and joint pain.', symptoms: ['High fever up to 104F', 'Severe headache', 'Pain behind the eyes', 'Joint and muscle pain', 'Skin rash', 'Mild bleeding from nose or gums'], causes: ['Bite of infected Aedes mosquito', 'Four types of dengue virus', 'Found in tropical and subtropical climates'], treatment: ['No specific antiviral treatment', 'Pain relievers like paracetamol', 'Rest and fluid intake', 'Hospitalization in severe cases', 'Platelet transfusion if needed'], prevention: ['Use mosquito repellents', 'Wear long sleeves and pants', 'Use mosquito nets', 'Eliminate standing water', 'Use insecticides'] },
  17: { name: 'Malaria', category: 'Viral', description: 'A life-threatening disease caused by parasites transmitted through infected mosquito bites.', symptoms: ['High fever', 'Chills and shaking', 'Headache', 'Nausea and vomiting', 'Muscle pain', 'Fatigue', 'Sweating'], causes: ['Plasmodium parasite', 'Bite of infected female Anopheles mosquito', 'Blood transfusion', 'Shared needles'], treatment: ['Antimalarial medications', 'Chloroquine', 'Artemisinin based combination therapy', 'Hospitalization for severe cases'], prevention: ['Use bed nets', 'Take antimalarial drugs when traveling', 'Use insect repellent', 'Wear protective clothing', 'Spray insecticides'] },
  18: { name: 'HIV/AIDS', category: 'Viral', description: 'A virus that attacks the body immune system making it harder to fight infections.', symptoms: ['Fever', 'Chills', 'Rash', 'Night sweats', 'Muscle aches', 'Sore throat', 'Fatigue', 'Swollen lymph nodes'], causes: ['Sexual contact with infected person', 'Sharing needles', 'Blood transfusion', 'Mother to child during birth or breastfeeding'], treatment: ['Antiretroviral therapy ART', 'Combination of HIV medicines', 'Regular monitoring of CD4 count', 'Treatment for opportunistic infections'], prevention: ['Use condoms', 'Get tested regularly', 'Do not share needles', 'Take PrEP medication', 'Avoid contact with infected blood'] },
  19: { name: 'Hepatitis B', category: 'Viral', description: 'A serious liver infection caused by the hepatitis B virus that can become chronic.', symptoms: ['Abdominal pain', 'Dark urine', 'Fever', 'Joint pain', 'Loss of appetite', 'Nausea', 'Weakness', 'Yellowing of skin jaundice'], causes: ['Unprotected sexual contact', 'Sharing needles', 'Mother to child at birth', 'Blood transfusion', 'Sharing personal items'], treatment: ['Antiviral medications', 'Interferon injections', 'Liver transplant in severe cases', 'Regular monitoring'], prevention: ['Hepatitis B vaccine', 'Use condoms', 'Do not share needles', 'Avoid contact with infected blood', 'Get tested if at risk'] },
  20: { name: 'Hepatitis C', category: 'Viral', description: 'A viral infection that causes liver inflammation sometimes leading to serious damage.', symptoms: ['Fatigue', 'Fever', 'Nausea', 'Loss of appetite', 'Abdominal pain', 'Jaundice', 'Dark urine', 'Often no symptoms for years'], causes: ['Sharing needles', 'Blood transfusion before 1992', 'Sexual contact', 'Mother to child at birth', 'Sharing personal care items'], treatment: ['Direct acting antiviral medications', 'Cure rate over 95 percent', 'Treatment duration 8 to 12 weeks', 'Liver transplant if needed'], prevention: ['Do not share needles', 'Practice safe sex', 'Avoid sharing personal items', 'Screen blood donations', 'Get tested if at risk'] },
  39: { name: 'Diabetes Type 1', category: 'Chronic', description: 'An autoimmune condition where the pancreas produces little or no insulin.', symptoms: ['Increased thirst', 'Frequent urination', 'Extreme hunger', 'Unintended weight loss', 'Fatigue', 'Blurred vision', 'Mood changes'], causes: ['Immune system attacks insulin producing cells', 'Genetic factors', 'Environmental triggers', 'Viral infections may trigger onset'], treatment: ['Insulin therapy required for life', 'Blood sugar monitoring', 'Carbohydrate counting', 'Insulin pump therapy', 'Healthy diet and exercise'], prevention: ['No known prevention for Type 1', 'Research into immune modulation ongoing', 'Early diagnosis and management prevent complications'] },
  40: { name: 'Diabetes Type 2', category: 'Chronic', description: 'A chronic condition affecting the way the body processes blood sugar.', symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Slow healing sores', 'Frequent infections', 'Tingling in hands or feet'], causes: ['Insulin resistance', 'Obesity', 'Physical inactivity', 'Poor diet', 'Genetics', 'Age over 45'], treatment: ['Lifestyle changes first', 'Metformin medication', 'Other diabetes medications', 'Insulin if needed', 'Blood sugar monitoring'], prevention: ['Maintain healthy weight', 'Exercise 30 minutes daily', 'Eat healthy diet', 'Avoid sugary drinks', 'Regular blood sugar screening'] },
  43: { name: 'Anemia', category: 'Chronic', description: 'A condition where you lack enough healthy red blood cells to carry oxygen to tissues.', symptoms: ['Fatigue and weakness', 'Pale skin', 'Shortness of breath', 'Dizziness', 'Cold hands and feet', 'Headaches', 'Chest pain'], causes: ['Iron deficiency most common', 'Vitamin B12 or folate deficiency', 'Chronic disease', 'Bone marrow problems', 'Blood loss', 'Inherited conditions'], treatment: ['Iron supplements', 'Vitamin B12 injections or supplements', 'Blood transfusions', 'Erythropoiesis stimulating agents', 'Treat underlying cause'], prevention: ['Iron rich diet meat beans and spinach', 'Vitamin C to enhance iron absorption', 'Vitamin B12 in diet or supplements', 'Regular blood tests'] },
  61: { name: 'Alzheimer', category: 'Neurological', description: 'A progressive disease that destroys memory and other important mental functions.', symptoms: ['Memory loss', 'Difficulty with problem solving', 'Confusion with time and place', 'Trouble understanding visual images', 'New problems with words', 'Misplacing things', 'Poor judgment'], causes: ['Age biggest risk factor', 'Genetic factors APOE gene', 'Head injuries', 'Heart health problems', 'Lifestyle and environment'], treatment: ['Cholinesterase inhibitors donepezil', 'Memantine', 'Medications for behavioral symptoms', 'Supportive care', 'No cure exists currently'], prevention: ['Stay mentally active', 'Exercise regularly', 'Eat healthy Mediterranean diet', 'Maintain social connections', 'Control cardiovascular risk factors'] },
  65: { name: 'Migraine', category: 'Neurological', description: 'A headache of varying intensity often accompanied by nausea and sensitivity to light.', symptoms: ['Intense throbbing headache', 'Nausea and vomiting', 'Sensitivity to light and sound', 'Visual disturbances aura', 'Pain worsens with activity', 'Lasts 4 to 72 hours'], causes: ['Hormonal changes', 'Stress', 'Certain foods cheese alcohol caffeine', 'Sleep changes', 'Sensory stimuli bright lights loud sounds', 'Genetics'], treatment: ['Pain relievers ibuprofen or aspirin', 'Triptans', 'Ergots', 'Anti-nausea medications', 'Preventive medications', 'Lifestyle modifications'], prevention: ['Identify and avoid triggers', 'Regular sleep schedule', 'Stay hydrated', 'Regular exercise', 'Stress management', 'Limit caffeine and alcohol'] },
  71: { name: 'Depression', category: 'Mental Health', description: 'A mental health disorder characterized by persistent sadness and loss of interest.', symptoms: ['Persistent sad or empty mood', 'Loss of interest in activities', 'Changes in appetite', 'Sleep disturbances', 'Fatigue', 'Feelings of worthlessness', 'Difficulty concentrating', 'Thoughts of death'], causes: ['Brain chemistry imbalance', 'Genetics', 'Life events trauma', 'Medical conditions', 'Medications', 'Substance abuse'], treatment: ['Antidepressant medications SSRIs', 'Psychotherapy CBT', 'Electroconvulsive therapy for severe cases', 'Lifestyle changes', 'Support groups'], prevention: ['Build strong social connections', 'Exercise regularly', 'Manage stress', 'Get adequate sleep', 'Seek help early', 'Avoid alcohol and drugs'] },
  79: { name: 'Arthritis', category: 'Musculoskeletal', description: 'Inflammation of one or more joints causing pain and stiffness that worsens with age.', symptoms: ['Joint pain', 'Stiffness especially in morning', 'Swelling', 'Redness around joint', 'Decreased range of motion', 'Fatigue in rheumatoid arthritis'], causes: ['Cartilage breakdown osteoarthritis', 'Autoimmune attack rheumatoid', 'Genetics', 'Obesity', 'Previous joint injury', 'Age'], treatment: ['Pain medications', 'NSAIDs', 'Disease modifying drugs for RA', 'Physical therapy', 'Joint replacement surgery', 'Corticosteroid injections'], prevention: ['Maintain healthy weight', 'Exercise regularly', 'Protect joints from injury', 'Fish oil supplements may help', 'Avoid repetitive joint strain'] },
};

const DiseaseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const disease = diseaseDetails[parseInt(id || '0')];

  const Section = ({ title, items }: { title: string; items: string[] }) => (
    <div style={{
      backgroundColor: 'white', borderRadius: theme.borderRadius,
      padding: '20px', border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.colors.cardShadow,
    }}>
      <h3 style={{ color: theme.colors.primaryDark, margin: '0 0 14px', fontSize: '14px', fontWeight: '600', paddingBottom: '10px', borderBottom: `1px solid ${theme.colors.border}` }}>
        {title}
      </h3>
      <ul style={{ paddingLeft: '18px', margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: '13px', color: theme.colors.text, marginBottom: '7px', lineHeight: '1.6' }}>{item}</li>
        ))}
      </ul>
    </div>
  );

  if (!disease) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
        <SideNav activeTab="diseases" setActiveTab={() => navigate('/diseases')} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopNav />
          <main style={{ flex: 1, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: theme.colors.text }}>Disease not found</h2>
              <button onClick={() => navigate('/diseases')} style={{ padding: '10px 20px', backgroundColor: theme.colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: theme.font }}>
                Back to Diseases
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="diseases" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/diseases')}
              style={{ padding: '7px 14px', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginBottom: '14px', fontFamily: theme.font }}
            >
              Back to Diseases
            </button>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>{disease.name}</h2>
            <span style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
              {disease.category}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.7', marginBottom: '24px', maxWidth: '720px' }}>
            {disease.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <Section title="Symptoms" items={disease.symptoms} />
            <Section title="Causes" items={disease.causes} />
            <Section title="Treatment" items={disease.treatment} />
            <Section title="Prevention" items={disease.prevention} />
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
            borderRadius: '12px', padding: '22px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 4px' }}>
                Want to consult a doctor about {disease.name}?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0 }}>
                Find nearby hospitals or book an appointment on MediConnect.
              </p>
            </div>
            <button
              onClick={() => navigate('/hospitals')}
              style={{ backgroundColor: 'white', color: theme.colors.primaryDark, border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: theme.font, whiteSpace: 'nowrap' }}
            >
              Find Hospital
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DiseaseDetailPage;
