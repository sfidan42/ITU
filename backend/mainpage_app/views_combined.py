from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers_combined import *


# --- 1. All Persons (Base Table) ---
class CombinedPersonView(APIView):
    def get(self, request):
        queryset = Person.objects.all()
        data = PersonOverviewSerializer(queryset, many=True).data
        return Response(data)


# --- 2. Academic Staff (All) ---
class CombinedAcademicStaffView(APIView):
    def get(self, request):
        queryset = AcademicPersonel.objects.select_related('registr_no').prefetch_related('high_scores')
        data = AcademicStaffSerializer(queryset, many=True).data
        return Response(data)


# --- 3. Academic Staff Subtypes by duty_type ---
class CombinedAcademicSubtypeView(APIView):
    DUTY_TYPE = None  # will be overridden

    def get(self, request):
        queryset = AcademicPersonel.objects.select_related('registr_no').prefetch_related('high_scores')
        if self.DUTY_TYPE:
            queryset = queryset.filter(duty_type=self.DUTY_TYPE)
        data = AcademicStaffSerializer(queryset, many=True).data
        return Response(data)


class CombinedResearchAssistantView(CombinedAcademicSubtypeView):
    DUTY_TYPE = "Araştırma_Görevlisi"


class CombinedInstructorView(CombinedAcademicSubtypeView):
    DUTY_TYPE = "Öğretim_Görevlisi"


class CombinedDoctorLecturerView(CombinedAcademicSubtypeView):
    DUTY_TYPE = "Dr_Öğretim_Üyesi"


class CombinedAssociateProfessorView(CombinedAcademicSubtypeView):
    DUTY_TYPE = "Doçent"


class CombinedProfessorView(CombinedAcademicSubtypeView):
    DUTY_TYPE = "Profesör"


# --- 4. Administrative Staff ---
class CombinedAdministrativeStaffView(APIView):
    def get(self, request):
        queryset = Personel.objects.prefetch_related('management_staff__promotions__prom_id')
        data = AdministrativeStaffSerializer(queryset, many=True).data
        return Response(data)
