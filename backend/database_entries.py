from mainpage_app.models import (
    Person, Personel, PersonelGetsLangCompensScore, LanguageCompensationScore,
    ManagementStaff, ManagementStaffGetsProm, Promotion, SystemAdmin,
    AcademicPersonel, HighAcademicGetsScore, LowAcademic, LowAcademicDutyExtends
)
from datetime import date
import random

# --- 1. PERSON (20 persons) ---
persons_data = []
for i in range(1, 21):
    persons_data.append({
        'tc_no': f'{11111111110 + i}',
        'name': f'Name{i}',
        'mid_name': None,
        'surname': f'Surname{i}',
        'personal_mail': f'name{i}.surname{i}@mycompany.com',
        'gender': random.choice(['Erkek', 'Kadın']),
        'registr_no': 1500000000 + i
    })

person_instances = {}
for data in persons_data:
    obj, _ = Person.objects.get_or_create(
        tc_no=data['tc_no'],
        defaults={
            'name': data['name'],
            'mid_name': data['mid_name'],
            'surname': data['surname'],
            'personal_mail': data['personal_mail'],
            'gender': data['gender']
        }
    )
    person_instances[data['registr_no']] = obj

# --- 2. PERSONEL ---
personel_data = []
for i in range(1, 21):
    personel_data.append({
        'registr_no': 1500000000 + i,
        'itu_mail': f'user{i}@itu.edu.tr',
        'department': random.choice(['IT','Finance','HR','Engineering','Architecture','Legal','Marketing']),
        'registration_date': date(2020 + i % 4, i % 12 + 1, i % 28 + 1),
        'status': random.choice(['aktif','dondurulmuş','ayrılmış'])
    })

personel_instances = {}
for data in personel_data:
    obj, _ = Personel.objects.get_or_create(
        person=person_instances[data['registr_no']],
        defaults={
            'itu_mail': data['itu_mail'],
            'department': data['department'],
            'registration_date': data['registration_date'],
            'status': data['status'],
        }
    )
    personel_instances[data['registr_no']] = obj

# --- 3. LANGUAGE_COMPENSATION_SCORE ---
lang_scores = [{'lang_comp_id': i, 'letter_score': random.choice(['A','B','C','D','E'])} for i in range(1,6)]
lang_score_instances = {}
for data in lang_scores:
    obj, _ = LanguageCompensationScore.objects.get_or_create(
        lang_comp_id=data['lang_comp_id'],
        defaults={'letter_score': data['letter_score']}
    )
    lang_score_instances[data['lang_comp_id']] = obj

# --- 4. PERSONEL_GETS_LANGCOMPENSSCORE ---
for registr_no in random.sample(list(personel_instances.keys()), 10):
    PersonelGetsLangCompensScore.objects.get_or_create(
        registr_no=personel_instances[registr_no],
        date=date(2023, random.randint(1,12), random.randint(1,28)),
        defaults={'lang_comp_id': lang_score_instances[random.randint(1,5)]}
    )

# --- 5. PROMOTION ---
promotions_data = [
    {'prom_id': i, 'date': date(2022+i,1,1), 'next_date': date(2023+i,1,1), 'description': f'Promotion{i}'} for i in range(1,6)
]
promotion_instances = {}
for data in promotions_data:
    obj, _ = Promotion.objects.get_or_create(
        prom_id=data['prom_id'],
        defaults={'date': data['date'], 'next_date': data['next_date'], 'description': data['description']}
    )
    promotion_instances[data['prom_id']] = obj

# --- 6. MANAGEMENT_STAFF (5 persons) ---
management_staff_instances = {}
for registr_no in range(1500000001, 1500000006):
    obj, _ = ManagementStaff.objects.get_or_create(
        registr_no=personel_instances[registr_no],
        defaults={'title': f'Title{registr_no}'}
    )
    management_staff_instances[registr_no] = obj

# --- 7. MANAGEMENT_STAFF_GETS_PROM ---
for registr_no in management_staff_instances.keys():
    ManagementStaffGetsProm.objects.get_or_create(
        registr_no=management_staff_instances[registr_no],
        prom_id=promotion_instances[random.randint(1,5)]
    )

# --- 8. SYSTEM_ADMIN (2 persons) ---
for registr_no in range(1500000006, 1500000008):
    SystemAdmin.objects.get_or_create(
        registr_no=personel_instances[registr_no],
        defaults={'user_name': f'admin_{registr_no}', 'encrypted_password': f'hash_{registr_no}'}
    )

# --- 9. ACADEMIC_PERSONEL (8 persons) ---
duty_types = ['Araştırma_Görevlisi', 'Öğretim_Görevlisi', 'Dr_Öğretim_Üyesi', 'Doçent', 'Profesör']
academic_staff_instances = {}
for idx, registr_no in enumerate(range(1500000008, 1500000016)):
    obj, _ = AcademicPersonel.objects.get_or_create(
        registr_no=personel_instances[registr_no],
        defaults={'duty_type': duty_types[idx % len(duty_types)]}
    )
    academic_staff_instances[registr_no] = obj

# --- 10. HIGH_ACADEMIC_GETS_SCORE ---
for registr_no in list(academic_staff_instances.keys())[:5]:
    HighAcademicGetsScore.objects.get_or_create(
        registr_no=academic_staff_instances[registr_no],
        score_date=date(2023, random.randint(1,12), random.randint(1,28)),
        defaults={'score_type': random.choice(['A+','A','B+','B','C'])}
    )

# --- 11. LOW_ACADEMIC & DUTY_EXTENDS (3 persons) ---
low_academic_instances = {}
for registr_no in list(academic_staff_instances.keys())[:3]:
    obj, _ = LowAcademic.objects.get_or_create(
        registr_no=academic_staff_instances[registr_no],
        defaults={'last_duty_ext_date': date(2023,12,31)}
    )
    low_academic_instances[registr_no] = obj

for registr_no in low_academic_instances.keys():
    LowAcademicDutyExtends.objects.get_or_create(
        registr_no=low_academic_instances[registr_no],
        ext_date=date(2023,1,1),
        defaults={'next_ext_date': date(2024,1,1)}
    )
