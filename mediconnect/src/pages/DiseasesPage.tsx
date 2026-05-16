import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const ALL_DISEASES = [
  { id: 1, name: 'Heart Disease', category: 'Cardiovascular', description: 'A range of conditions affecting the heart including coronary artery disease and heart failure.' },
  { id: 2, name: 'Hypertension', category: 'Cardiovascular', description: 'A condition where blood pressure in the arteries is persistently elevated.' },
  { id: 3, name: 'Stroke', category: 'Cardiovascular', description: 'Occurs when blood supply to part of the brain is cut off causing brain damage.' },
  { id: 4, name: 'Atrial Fibrillation', category: 'Cardiovascular', description: 'An irregular and often rapid heart rate that can increase risk of stroke.' },
  { id: 5, name: 'Heart Failure', category: 'Cardiovascular', description: 'A condition where the heart cannot pump enough blood to meet the body needs.' },
  { id: 6, name: 'Coronary Artery Disease', category: 'Cardiovascular', description: 'Narrowing of coronary arteries due to plaque buildup reducing blood flow to the heart.' },
  { id: 7, name: 'Asthma', category: 'Respiratory', description: 'A condition in which airways narrow and swell producing extra mucus making breathing difficult.' },
  { id: 8, name: 'COPD', category: 'Respiratory', description: 'Chronic obstructive pulmonary disease causes obstructed airflow from the lungs.' },
  { id: 9, name: 'Pneumonia', category: 'Respiratory', description: 'An infection that inflames air sacs in one or both lungs which may fill with fluid.' },
  { id: 10, name: 'Bronchitis', category: 'Respiratory', description: 'Inflammation of the lining of bronchial tubes which carry air to and from the lungs.' },
  { id: 11, name: 'Tuberculosis', category: 'Respiratory', description: 'A potentially serious infectious bacterial disease that mainly affects the lungs.' },
  { id: 12, name: 'Influenza', category: 'Respiratory', description: 'A contagious respiratory illness caused by influenza viruses affecting nose throat and lungs.' },
  { id: 13, name: 'COVID-19', category: 'Respiratory', description: 'An infectious disease caused by the SARS-CoV-2 virus causing respiratory illness.' },
  { id: 14, name: 'Sinusitis', category: 'Respiratory', description: 'Inflammation of the sinuses causing nasal congestion pain and pressure.' },
  { id: 15, name: 'Whooping Cough', category: 'Respiratory', description: 'A highly contagious bacterial respiratory tract infection causing severe coughing fits.' },
  { id: 16, name: 'Dengue Fever', category: 'Viral', description: 'A mosquito-borne viral infection causing high fever severe headache and joint pain.' },
  { id: 17, name: 'Malaria', category: 'Viral', description: 'A life-threatening disease caused by parasites transmitted through infected mosquito bites.' },
  { id: 18, name: 'HIV/AIDS', category: 'Viral', description: 'A virus that attacks the body immune system making it harder to fight infections.' },
  { id: 19, name: 'Hepatitis B', category: 'Viral', description: 'A serious liver infection caused by the hepatitis B virus that can become chronic.' },
  { id: 20, name: 'Hepatitis C', category: 'Viral', description: 'A viral infection that causes liver inflammation sometimes leading to serious damage.' },
  { id: 21, name: 'Chickenpox', category: 'Viral', description: 'A highly contagious viral infection causing an itchy blister-like rash on the skin.' },
  { id: 22, name: 'Measles', category: 'Viral', description: 'A highly contagious viral disease preventable by vaccination causing rash and fever.' },
  { id: 23, name: 'Mumps', category: 'Viral', description: 'A contagious viral infection that primarily affects the salivary glands.' },
  { id: 24, name: 'Rabies', category: 'Viral', description: 'A deadly virus spread to people from saliva of infected animals through bites.' },
  { id: 25, name: 'Ebola', category: 'Viral', description: 'A rare but deadly virus causing fever and severe internal bleeding.' },
  { id: 26, name: 'Zika Virus', category: 'Viral', description: 'A mosquito-borne virus that can cause birth defects in babies born to infected mothers.' },
  { id: 27, name: 'Polio', category: 'Viral', description: 'A disabling and life-threatening disease caused by poliovirus affecting the nervous system.' },
  { id: 28, name: 'Herpes', category: 'Viral', description: 'A viral infection causing sores on mouth or genitals caused by herpes simplex virus.' },
  { id: 29, name: 'Typhoid', category: 'Bacterial', description: 'A bacterial infection spread through contaminated food and water causing high fever.' },
  { id: 30, name: 'Cholera', category: 'Bacterial', description: 'An infectious disease causing severe watery diarrhea which can lead to dehydration.' },
  { id: 31, name: 'Meningitis', category: 'Bacterial', description: 'Inflammation of membranes surrounding the brain and spinal cord usually caused by bacteria.' },
  { id: 32, name: 'Tetanus', category: 'Bacterial', description: 'A serious bacterial infection affecting the nervous system causing muscle stiffness.' },
  { id: 33, name: 'Leprosy', category: 'Bacterial', description: 'A chronic infectious disease caused by Mycobacterium leprae affecting skin and nerves.' },
  { id: 34, name: 'Tonsillitis', category: 'Bacterial', description: 'Inflammation of the tonsils causing sore throat difficulty swallowing and fever.' },
  { id: 35, name: 'Urinary Tract Infection', category: 'Bacterial', description: 'An infection in any part of the urinary system causing pain during urination.' },
  { id: 36, name: 'Peptic Ulcer', category: 'Bacterial', description: 'Sores that develop on the inside lining of the stomach caused by H. pylori bacteria.' },
  { id: 37, name: 'Appendicitis', category: 'Bacterial', description: 'Inflammation of the appendix causing severe abdominal pain requiring surgery.' },
  { id: 38, name: 'Food Poisoning', category: 'Bacterial', description: 'Illness caused by eating contaminated food containing bacteria viruses or toxins.' },
  { id: 39, name: 'Diabetes Type 1', category: 'Chronic', description: 'An autoimmune condition where the pancreas produces little or no insulin.' },
  { id: 40, name: 'Diabetes Type 2', category: 'Chronic', description: 'A chronic condition affecting the way the body processes blood sugar.' },
  { id: 41, name: 'Obesity', category: 'Chronic', description: 'A complex disease involving excessive body fat increasing risk of other diseases.' },
  { id: 42, name: 'Thyroid Disorder', category: 'Chronic', description: 'A condition affecting the thyroid gland and its hormone production causing fatigue.' },
  { id: 43, name: 'Anemia', category: 'Chronic', description: 'A condition where you lack enough healthy red blood cells to carry oxygen to tissues.' },
  { id: 44, name: 'Kidney Disease', category: 'Chronic', description: 'Gradual loss of kidney function leading to dangerous levels of waste in the blood.' },
  { id: 45, name: 'Liver Cirrhosis', category: 'Chronic', description: 'Late stage scarring of the liver caused by many liver diseases and conditions.' },
  { id: 46, name: 'Gallstones', category: 'Chronic', description: 'Hardened deposits of digestive fluid that can form in the gallbladder.' },
  { id: 47, name: 'Pancreatitis', category: 'Chronic', description: 'Inflammation of the pancreas that causes abdominal pain and digestive problems.' },
  { id: 48, name: 'GERD', category: 'Chronic', description: 'Gastroesophageal reflux disease where stomach acid irritates the food pipe lining.' },
  { id: 49, name: 'Celiac Disease', category: 'Chronic', description: 'An immune reaction to eating gluten a protein found in wheat barley and rye.' },
  { id: 50, name: 'Crohn Disease', category: 'Chronic', description: 'A type of inflammatory bowel disease causing inflammation of the digestive tract.' },
  { id: 51, name: 'Lung Cancer', category: 'Cancer', description: 'A cancer that begins in the lungs and is the leading cause of cancer deaths worldwide.' },
  { id: 52, name: 'Breast Cancer', category: 'Cancer', description: 'A cancer that forms in the cells of the breasts affecting both men and women.' },
  { id: 53, name: 'Colorectal Cancer', category: 'Cancer', description: 'Cancer of the colon or rectum located at the digestive tracts lower end.' },
  { id: 54, name: 'Prostate Cancer', category: 'Cancer', description: 'Cancer in the prostate gland which produces seminal fluid in men.' },
  { id: 55, name: 'Stomach Cancer', category: 'Cancer', description: 'Cancer that begins in the stomach lining and can spread to other organs.' },
  { id: 56, name: 'Liver Cancer', category: 'Cancer', description: 'Cancer that begins in the cells of the liver often linked to hepatitis infection.' },
  { id: 57, name: 'Cervical Cancer', category: 'Cancer', description: 'Cancer occurring in the cells of the cervix preventable through HPV vaccination.' },
  { id: 58, name: 'Leukemia', category: 'Cancer', description: 'Cancer of the body blood forming tissues including bone marrow and lymphatic system.' },
  { id: 59, name: 'Lymphoma', category: 'Cancer', description: 'Cancer that begins in infection fighting cells of the immune system called lymphocytes.' },
  { id: 60, name: 'Skin Cancer', category: 'Cancer', description: 'The abnormal growth of skin cells most often developing on sun-exposed skin.' },
  { id: 61, name: 'Alzheimer', category: 'Neurological', description: 'A progressive disease that destroys memory and other important mental functions.' },
  { id: 62, name: 'Parkinson', category: 'Neurological', description: 'A disorder of the central nervous system that affects movement causing tremors.' },
  { id: 63, name: 'Epilepsy', category: 'Neurological', description: 'A neurological disorder causing recurrent seizures due to abnormal brain activity.' },
  { id: 64, name: 'Multiple Sclerosis', category: 'Neurological', description: 'A disease where the immune system attacks the protective sheath covering nerve fibers.' },
  { id: 65, name: 'Migraine', category: 'Neurological', description: 'A headache of varying intensity often accompanied by nausea and sensitivity to light.' },
  { id: 66, name: 'Vertigo', category: 'Neurological', description: 'A sensation of feeling off balance or dizzy often caused by inner ear problems.' },
  { id: 67, name: 'Autism', category: 'Neurological', description: 'A developmental disorder affecting communication behavior and social interaction.' },
  { id: 68, name: 'ADHD', category: 'Neurological', description: 'A disorder affecting attention hyperactivity and impulsiveness in children and adults.' },
  { id: 69, name: 'Dementia', category: 'Neurological', description: 'A decline in memory language and thinking skills severe enough to interfere with daily life.' },
  { id: 70, name: 'Brain Tumor', category: 'Neurological', description: 'A mass or growth of abnormal cells in the brain that can be cancerous or benign.' },
  { id: 71, name: 'Depression', category: 'Mental Health', description: 'A mental health disorder characterized by persistent sadness and loss of interest.' },
  { id: 72, name: 'Anxiety Disorder', category: 'Mental Health', description: 'A mental health condition involving excessive and persistent worry and fear.' },
  { id: 73, name: 'Schizophrenia', category: 'Mental Health', description: 'A serious mental disorder affecting how a person thinks feels and behaves.' },
  { id: 74, name: 'Bipolar Disorder', category: 'Mental Health', description: 'A mental health condition causing extreme mood swings including emotional highs and lows.' },
  { id: 75, name: 'OCD', category: 'Mental Health', description: 'Obsessive compulsive disorder causing repeated unwanted thoughts and behaviors.' },
  { id: 76, name: 'PTSD', category: 'Mental Health', description: 'Post traumatic stress disorder triggered by experiencing or witnessing a terrifying event.' },
  { id: 77, name: 'Eating Disorders', category: 'Mental Health', description: 'Serious conditions related to persistent eating behaviors that negatively impact health.' },
  { id: 78, name: 'Insomnia', category: 'Mental Health', description: 'A sleep disorder that makes it hard to fall asleep or stay asleep.' },
  { id: 79, name: 'Arthritis', category: 'Musculoskeletal', description: 'Inflammation of one or more joints causing pain and stiffness that worsens with age.' },
  { id: 80, name: 'Osteoporosis', category: 'Musculoskeletal', description: 'A disease in which bones become weak and brittle increasing risk of fractures.' },
  { id: 81, name: 'Back Pain', category: 'Musculoskeletal', description: 'A common condition ranging from dull aching to sharp shooting pain in the back.' },
  { id: 82, name: 'Gout', category: 'Musculoskeletal', description: 'A form of arthritis characterized by severe pain redness and swelling in joints.' },
  { id: 83, name: 'Scoliosis', category: 'Musculoskeletal', description: 'An abnormal lateral curvature of the spine often diagnosed in adolescents.' },
  { id: 84, name: 'Fibromyalgia', category: 'Musculoskeletal', description: 'A disorder characterized by widespread musculoskeletal pain fatigue and sleep issues.' },
  { id: 85, name: 'Eczema', category: 'Skin', description: 'A condition that makes skin red inflamed and itchy often occurring in children.' },
  { id: 86, name: 'Psoriasis', category: 'Skin', description: 'A skin disease that causes red itchy scaly patches on the knees elbows and scalp.' },
  { id: 87, name: 'Acne', category: 'Skin', description: 'A skin condition that occurs when hair follicles become plugged with oil and dead skin.' },
  { id: 88, name: 'Rosacea', category: 'Skin', description: 'A common skin condition that causes redness and visible blood vessels in the face.' },
  { id: 89, name: 'Fungal Infection', category: 'Skin', description: 'Infections caused by fungi including ringworm athletes foot and nail fungus.' },
  { id: 90, name: 'Lupus', category: 'Skin', description: 'A disease where the immune system attacks its own tissues causing skin and organ damage.' },
  { id: 91, name: 'Glaucoma', category: 'Eye', description: 'A condition that damages the optic nerve often caused by high pressure in the eye.' },
  { id: 92, name: 'Cataracts', category: 'Eye', description: 'Clouding of the lens inside the eye causing blurry vision that affects daily activities.' },
  { id: 93, name: 'Macular Degeneration', category: 'Eye', description: 'A disease causing deterioration of central vision due to damage of the macula.' },
  { id: 94, name: 'Conjunctivitis', category: 'Eye', description: 'Inflammation of the transparent membrane lining the eyelid causing pink eye.' },
  { id: 95, name: 'Diabetic Retinopathy', category: 'Eye', description: 'A diabetes complication that affects the eyes caused by damage to retinal blood vessels.' },
  { id: 96, name: 'Irritable Bowel Syndrome', category: 'Digestive', description: 'A common disorder affecting the large intestine causing cramping bloating and diarrhea.' },
  { id: 97, name: 'Ulcerative Colitis', category: 'Digestive', description: 'An inflammatory bowel disease causing inflammation and ulcers in the digestive tract.' },
  { id: 98, name: 'Hemorrhoids', category: 'Digestive', description: 'Swollen veins in the lowest part of the rectum and anus causing pain and bleeding.' },
  { id: 99, name: 'Gastritis', category: 'Digestive', description: 'Inflammation of the stomach lining causing nausea vomiting and stomach pain.' },
  { id: 100, name: 'Diverticulitis', category: 'Digestive', description: 'Inflammation of pouches that can form in the intestinal walls causing severe pain.' },
  { id: 101, name: 'Sickle Cell Disease', category: 'Blood', description: 'An inherited red blood cell disorder causing cells to become hard and sickle shaped.' },
  { id: 102, name: 'Hemophilia', category: 'Blood', description: 'A rare disorder where blood does not clot normally due to lack of clotting factors.' },
  { id: 103, name: 'Deep Vein Thrombosis', category: 'Blood', description: 'A blood clot forming in a deep vein usually in the leg that can be life threatening.' },
  { id: 104, name: 'Thalassemia', category: 'Blood', description: 'An inherited blood disorder causing the body to have less hemoglobin than normal.' },
  { id: 105, name: 'Hyperthyroidism', category: 'Endocrine', description: 'A condition where the thyroid gland produces too much thyroid hormone causing rapid heartbeat.' },
  { id: 106, name: 'Hypothyroidism', category: 'Endocrine', description: 'A condition where the thyroid gland does not produce enough thyroid hormone.' },
  { id: 107, name: 'Cushing Syndrome', category: 'Endocrine', description: 'A condition caused by prolonged exposure to high levels of cortisol in the body.' },
  { id: 108, name: 'Polycystic Ovary Syndrome', category: 'Endocrine', description: 'A hormonal disorder causing enlarged ovaries with small cysts on the outer edges.' },
];

const CATEGORIES = ['All', 'Cardiovascular', 'Respiratory', 'Viral', 'Bacterial', 'Chronic', 'Cancer', 'Neurological', 'Mental Health', 'Musculoskeletal', 'Skin', 'Eye', 'Digestive', 'Blood', 'Endocrine'];

const columns = [
  { key: 'name', label: 'Disease Name' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
];

const DiseasesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('diseases');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.replace(/[<>{}]/g, ''));
  };

  const filtered = ALL_DISEASES.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Disease Directory</h2>
            <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>
              {ALL_DISEASES.length} diseases across {CATEGORIES.length - 1} categories
            </p>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={handleSearch}
              maxLength={50}
              style={{
                padding: '9px 14px', borderRadius: '8px',
                border: `1px solid ${theme.colors.primaryBorder}`,
                fontSize: '13px', outline: 'none', width: '300px',
                fontFamily: theme.font, color: theme.colors.text, backgroundColor: 'white',
              }}
            />
            <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
              {filtered.length} results
            </span>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', border: 'none',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? theme.colors.primary : theme.colors.primaryLight,
                  color: selectedCategory === cat ? 'white' : theme.colors.primaryDark,
                  fontFamily: theme.font,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: 'white', borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.colors.cardShadow, overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '11px 18px', textAlign: 'left', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${theme.colors.primaryBorder}` }}>Disease Name</th>
                  <th style={{ padding: '11px 18px', textAlign: 'left', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${theme.colors.primaryBorder}` }}>Category</th>
                  <th style={{ padding: '11px 18px', textAlign: 'left', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${theme.colors.primaryBorder}` }}>Description</th>
                  <th style={{ padding: '11px 18px', textAlign: 'left', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${theme.colors.primaryBorder}` }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: theme.colors.textSecondary }}>No diseases found.</td>
                  </tr>
                ) : filtered.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: i % 2 === 0 ? 'white' : '#fafcfb' }}>
                    <td style={{ padding: '12px 18px', color: theme.colors.primaryDark, fontWeight: '500' }}>{d.name}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark,
                        padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                      }}>{d.category}</span>
                    </td>
                    <td style={{ padding: '12px 18px', color: theme.colors.textSecondary, lineHeight: '1.5', maxWidth: '400px' }}>{d.description}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <button
                        onClick={() => navigate(`/diseases/${d.id}`)}
                        style={{
                          padding: '5px 12px', backgroundColor: theme.colors.primaryLight,
                          color: theme.colors.primaryDark, border: `1px solid ${theme.colors.primaryBorder}`,
                          borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                          fontFamily: theme.font,
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DiseasesPage;
