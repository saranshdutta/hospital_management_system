"""Create MySQL database if it doesn't exist, then run seed."""
import sys, os, re, pymysql

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:Ansh%400203@localhost:3306/hospital_management_system"
)

pattern = r"mysql\+pymysql://([^:]+):([^@]+)@([^:/]+):?(\d*)/(.+)"
match = re.match(pattern, DATABASE_URL)
if not match:
    print("ERROR: Could not parse DATABASE_URL")
    sys.exit(1)

db_user = match.group(1)
db_pass = match.group(2).replace("%40", "@")
db_host = match.group(3)
db_port = int(match.group(4)) if match.group(4) else 3306
db_name = match.group(5)

print("Connecting to MySQL at {}:{} as '{}'...".format(db_host, db_port, db_user))

try:
    conn = pymysql.connect(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_pass,
        charset="utf8mb4",
    )
    with conn.cursor() as cursor:
        sql = "CREATE DATABASE IF NOT EXISTS `{}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci".format(db_name)
        cursor.execute(sql)
    conn.commit()
    conn.close()
    print("  [OK] Database '{}' is ready".format(db_name))
except pymysql.err.OperationalError as e:
    print("ERROR: Cannot connect to MySQL: {}".format(e))
    print("  Make sure MySQL is running and credentials in .env are correct.")
    sys.exit(1)

# Now create all tables and seed
from app.database import engine, SessionLocal, Base
from app.models import User, UserRole, Medicine, Hospital
from app.auth import get_password_hash

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("  [OK] Tables created")

db = SessionLocal()

try:
    # Admin user
    ADMIN_EMAIL = "admin@pharmacare.com"
    ADMIN_PASSWORD = "Admin@1234"
    existing_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not existing_admin:
        admin = User(
            name="PharmaCare Admin",
            email=ADMIN_EMAIL,
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            role=UserRole.admin,
        )
        db.add(admin)
        db.commit()
        print("  [OK] Admin created -> {} / {}".format(ADMIN_EMAIL, ADMIN_PASSWORD))
    else:
        print("  [INFO] Admin already exists, skipping.")

    # Sample medicines
    medicines = [
        Medicine(name="Paracetamol 500mg", category="Analgesic",
            description="Fever and mild-to-moderate pain relief. Suitable for adults and children.",
            price=5.99, stock=500,
            image_url="/Paracetamol.jpg"),
        Medicine(name="Amoxicillin 250mg", category="Antibiotic",
            description="Broad-spectrum antibiotic for bacterial infections.",
            price=12.50, stock=85,
            image_url="/Amoxicillin.jpg"),
        Medicine(name="Ibuprofen 400mg", category="Anti-inflammatory",
            description="NSAID for pain, fever, and inflammation.",
            price=7.25, stock=320,
            image_url="/Ibuprofen.webp"),
        Medicine(name="Vitamin C 1000mg", category="Supplement",
            description="High-potency Vitamin C for immune support.",
            price=15.00, stock=45,
            image_url="/VitaminC.jpg"),
        Medicine(name="Cough Syrup 100ml", category="Cough & Cold",
            description="Effective relief from dry and tickly coughs. Non-drowsy formula.",
            price=9.99, stock=30,
            image_url="/CoughSyrup.jpg"),
        Medicine(name="Metformin 500mg", category="Diabetes",
            description="First-line medication for type 2 diabetes.",
            price=8.75, stock=200,
            image_url="/Metformin.jpg"),
        Medicine(name="Omeprazole 20mg", category="Gastric",
            description="Proton pump inhibitor for acid reflux and heartburn.",
            price=11.00, stock=150,
            image_url="/Omeprazole.jpg"),
        Medicine(name="Cetirizine 10mg", category="Antihistamine",
            description="Antihistamine for hay fever and allergic rhinitis.",
            price=6.50, stock=400,
            image_url="/Cetirizine.avif"),
        Medicine(name="Aspirin 81mg", category="Cardiovascular",
            description="Low dose aspirin for cardiovascular health.",
            price=4.50, stock=600,
            image_url="/Aspirin.jpg"),
        Medicine(name="Lisinopril 10mg", category="Blood Pressure",
            description="ACE inhibitor used to treat high blood pressure and heart failure.",
            price=14.20, stock=100,
            image_url="/Lisinopril.jpg"),
        Medicine(name="Albuterol Inhaler", category="Respiratory",
            description="Bronchodilator for preventing and treating wheezing and shortness of breath.",
            price=25.00, stock=75,
            image_url="/AlbuterolInhaler.webp"),
        Medicine(name="Atorvastatin 40mg", category="Cholesterol",
            description="Statin medication to lower cholesterol and triglyceride levels.",
            price=18.50, stock=120,
            image_url="/Atorvastatin.jpg"),
        Medicine(name="Ciprofloxacin 500mg", category="Antibiotic", description="Treats various bacterial infections.", price=18.0, stock=200, image_url="/Ciprofloxacin.jpg"),
        Medicine(name="Azithromycin 250mg", category="Antibiotic", description="Treats a wide variety of bacterial infections.", price=22.5, stock=150, image_url="/Azithromycin.jpg"),
        Medicine(name="Sertraline 50mg", category="Antidepressant", description="Used to treat depression, panic attacks.", price=12.0, stock=300, image_url="/Sertraline.jpg"),
        Medicine(name="Amlodipine 5mg", category="Blood Pressure", description="Treats high blood pressure and chest pain.", price=7.50, stock=500, image_url="/Amlodipine.jpg"),
        Medicine(name="Simvastatin 20mg", category="Cholesterol", description="Used along with a proper diet to help lower 'bad' cholesterol.", price=19.99, stock=100, image_url="/Simvastatin.jpg"),
        Medicine(name="Losartan 50mg", category="Blood Pressure", description="Treats high blood pressure.", price=11.20, stock=450, image_url="/Losartan.jpg"),
        Medicine(name="Levothyroxine 50mcg", category="Thyroid", description="Used to treat an underactive thyroid (hypothyroidism).", price=9.50, stock=120, image_url="/Levothyroxine.jpg"),
        Medicine(name="Pantoprazole 40mg", category="Gastric", description="Treats certain conditions in which there is too much acid in the stomach.", price=13.00, stock=200, image_url="/Pantoprazole.jpg"),
        Medicine(name="Gabapentin 300mg", category="Neuropathic Pain", description="Treats nerve pain and seizures.", price=16.75, stock=180, image_url="/Gabapentin.webp"),
        Medicine(name="Montelukast 10mg", category="Allergy", description="Used regularly to prevent the wheezing and shortness of breath.", price=21.00, stock=90, image_url="/Montelukast.jpg"),
        Medicine(name="Fluticasone Propionate", category="Respiratory", description="Nasal spray to relieve seasonal and year-round allergic and non-allergic nasal symptoms.", price=28.50, stock=50, image_url="/AlbuterolInhaler.webp"),
        Medicine(name="Escitalopram 10mg", category="Antidepressant", description="Treats depression and anxiety.", price=14.50, stock=210, image_url="/Escitalopram.jpg"),
        Medicine(name="Tamsulosin 0.4mg", category="Prostate", description="Used by men to treat the symptoms of an enlarged prostate.", price=10.00, stock=60, image_url="/Tamsulosin.jpg"),
        Medicine(name="Rosuvastatin 10mg", category="Cholesterol", description="Used to reduce the risk of heart attack and stroke.", price=25.00, stock=110, image_url="/Rosuvastatin.jpg"),
        Medicine(name="Duloxetine 30mg", category="Antidepressant", description="Treats depression and anxiety, as well as nerve pain.", price=19.25, stock=75, image_url="/Duloxetine.jpg"),
        Medicine(name="Meloxicam 15mg", category="NSAID", description="Treats pain and swelling symptoms.", price=8.80, stock=350, image_url="/Meloxicam.jpg"),
        Medicine(name="Clopidogrel 75mg", category="Blood Thinner", description="Helps to prevent platelets in your blood from sticking together.", price=17.00, stock=140, image_url="/Clopidogrel.jpg"),
        Medicine(name="Prednisone 20mg", category="Corticosteroid", description="Provides relief for inflamed areas of the body.", price=6.00, stock=400, image_url="/Prednisone.jpg"),
        Medicine(name="Hydrochlorothiazide 25mg", category="Diuretic", description="Treats high blood pressure and fluid retention.", price=5.50, stock=500, image_url="/Hydrochlorothiazide.jpg"),
        Medicine(name="Ranitidine 150mg", category="Antacid", description="Decreases the amount of acid your stomach makes.", price=9.00, stock=250, image_url="/Ranitidine.jpg"),
    ]
    
    updated_count = 0
    added_count = 0
    for med in medicines:
        existing = db.query(Medicine).filter(Medicine.name == med.name).first()
        if not existing:
            db.add(med)
            added_count += 1
        else:
            # Update image if changed
            if existing.image_url != med.image_url:
                existing.image_url = med.image_url
                updated_count += 1
            
    if added_count > 0 or updated_count > 0:
        db.commit()
        if added_count > 0:
            print("  [OK] Seeded {} new medicines".format(added_count))
        if updated_count > 0:
            print("  [OK] Updated images for {} existing medicines".format(updated_count))
    else:
        print("  [INFO] No new medicines to seed or update, skipping.")

    # Sample hospitals
    if db.query(Hospital).count() == 0:
        hospitals = [
            Hospital(name="City General Hospital",
                contact="+91 11 2345-6789", address="14 Health Avenue, New Delhi - 110001"),
            Hospital(name="Westside Clinic",
                contact="+91 22 9876-5432", address="56 Wellness Boulevard, Mumbai - 400001"),
            Hospital(name="Sunrise Medical Center",
                contact="+91 80 5555-1234", address="78 Recovery Road, Bengaluru - 560001"),
            Hospital(name="Apollo Specialty Hospital",
                contact="+91 44 2829-3333", address="21 Greams Lane, Chennai - 600006"),
        ]
        db.add_all(hospitals)
        db.commit()
        print("  [OK] Seeded {} hospitals".format(len(hospitals)))
    else:
        print("  [INFO] Hospitals already exist, skipping.")

    print("")
    print("SEED COMPLETE! Start the server with:")
    print("   python run.py")
    print("")
    print("Admin login -> {} / {}".format(ADMIN_EMAIL, ADMIN_PASSWORD))

except Exception as e:
    db.rollback()
    print("SEED FAILED: {}".format(e))
    raise
finally:
    db.close()
