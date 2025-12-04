from rest_framework import serializers
from .models import *

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class PersonelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personel
        fields = '__all__'

    def validate_registr_no(self, value):
        if not Person.objects.filter(registr_no=value.registr_no).exists():
            raise serializers.ValidationError("No matching Person with this registr_no exists.")
        return value


class LanguageCompensationScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageCompensationScore
        fields = '__all__'


class PersonelGetsLangCompensScoreSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=Personel.objects.all())
    lang_comp_id = serializers.PrimaryKeyRelatedField(queryset=LanguageCompensationScore.objects.all())

    class Meta:
        model = PersonelGetsLangCompensScore
        fields = '__all__'


class ManagementStaffSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=Personel.objects.all())

    class Meta:
        model = ManagementStaff
        fields = '__all__'


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'


class ManagementStaffGetsPromSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=ManagementStaff.objects.all())
    prom_id = serializers.PrimaryKeyRelatedField(queryset=Promotion.objects.all())

    class Meta:
        model = ManagementStaffGetsProm
        fields = '__all__'


class SystemAdminSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=Personel.objects.all())

    class Meta:
        model = SystemAdmin
        fields = '__all__'


class AcademicPersonelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicPersonel
        fields = '__all__'

    def validate_registr_no(self, value):
        if not Personel.objects.filter(registr_no=value.registr_no).exists():
            raise serializers.ValidationError("No Personel record found for this registr_no.")
        return value


class HighAcademicGetsScoreSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=AcademicPersonel.objects.all())

    class Meta:
        model = HighAcademicGetsScore
        fields = '__all__'


class LowAcademicSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=AcademicPersonel.objects.all())

    class Meta:
        model = LowAcademic
        fields = '__all__'


class LowAcademicDutyExtendsSerializer(serializers.ModelSerializer):
    registr_no = serializers.PrimaryKeyRelatedField(queryset=LowAcademic.objects.all())

    class Meta:
        model = LowAcademicDutyExtends
        fields = '__all__'
