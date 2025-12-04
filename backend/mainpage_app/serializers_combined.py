from rest_framework import serializers
from .models import *


class PersonOverviewSerializer(serializers.ModelSerializer):
    registr_no = serializers.IntegerField(source='personel.registr_no', read_only=True)
    
    class Meta:
        model = Person
        fields = ['registr_no', 'name', 'mid_name', 'surname', 'personal_mail', 'gender']


class AcademicStaffSerializer(serializers.ModelSerializer):
    person = serializers.SerializerMethodField()
    high_scores = serializers.SerializerMethodField()
    duty_extensions = serializers.SerializerMethodField()

    class Meta:
        model = AcademicPersonel
        fields = ['registr_no', 'duty_type', 'person', 'high_scores', 'duty_extensions']

    def get_person(self, obj):
        personel = obj.registr_no  # AcademicPersonel.registr_no is Personel
        if personel and personel.person:
            return PersonOverviewSerializer(personel.person).data
        return None

    def get_high_scores(self, obj):
        return [{'score_date': s.score_date, 'score_type': s.score_type} for s in obj.high_scores.all()]

    def get_duty_extensions(self, obj):
        low_academic = getattr(obj, 'low_academic', None)
        if not low_academic:
            return []
        return [
            {
                'ext_date': e.ext_date,
                'next_ext_date': e.next_ext_date,
            } for e in low_academic.duty_extends.all()
        ]
    

class AdministrativeStaffSerializer(serializers.ModelSerializer):
    registr_no = serializers.IntegerField(source='person.registr_no', read_only=True)
    person = serializers.SerializerMethodField()
    management_staff = serializers.SerializerMethodField()

    class Meta:
        model = Personel
        fields = [
            'registr_no', 'itu_mail', 'department',
            'registration_date', 'status',
            'person', 'management_staff'
        ]

    def get_person(self, obj):
        if obj.person:
            return PersonOverviewSerializer(obj.person).data
        return None

    def get_management_staff(self, obj):
        if hasattr(obj, 'management_staff'):
            ms = obj.management_staff
            return {
                'title': ms.title,
                'promotions': [
                    {
                        'prom_id': p.prom_id.prom_id,
                        'date': p.prom_id.date,
                        'next_date': p.prom_id.next_date,
                        'description': p.prom_id.description,
                    }
                    for p in ms.promotions.all()  # <-- use related_name
                ]
            }
        return None
