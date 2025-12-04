from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import *
from .serializers import *

# PERSON
class PersonListCreateView(ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class PersonDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    lookup_field = 'tc_no'


# PERSONEL
class PersonelListCreateView(ListCreateAPIView):
    queryset = Personel.objects.all()
    serializer_class = PersonelSerializer

class PersonelDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Personel.objects.all()
    serializer_class = PersonelSerializer
    lookup_field = 'registr_no'


# LANGUAGE_COMPENSATION_SCORE
class LanguageCompensationScoreListCreateView(ListCreateAPIView):
    queryset = LanguageCompensationScore.objects.all()
    serializer_class = LanguageCompensationScoreSerializer


# PERSONEL_GETS_LANGCOMPENSSCORE (no single item view; composite PK)
class PersonelGetsLangCompensScoreListCreateView(ListCreateAPIView):
    queryset = PersonelGetsLangCompensScore.objects.all()
    serializer_class = PersonelGetsLangCompensScoreSerializer


# MANAGEMENT_STAFF
class ManagementStaffListCreateView(ListCreateAPIView):
    queryset = ManagementStaff.objects.all()
    serializer_class = ManagementStaffSerializer

class ManagementStaffDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ManagementStaff.objects.all()
    serializer_class = ManagementStaffSerializer
    lookup_field = 'registr_no'


# PROMOTION
class PromotionListCreateView(ListCreateAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

class PromotionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    lookup_field = 'prom_id'


# MANAGEMENT_STAFF_GETS_PROM (composite PK)
class ManagementStaffGetsPromListCreateView(ListCreateAPIView):
    queryset = ManagementStaffGetsProm.objects.all()
    serializer_class = ManagementStaffGetsPromSerializer


# SYSTEM_ADMIN
class SystemAdminListCreateView(ListCreateAPIView):
    queryset = SystemAdmin.objects.all()
    serializer_class = SystemAdminSerializer

class SystemAdminDetailView(RetrieveUpdateDestroyAPIView):
    queryset = SystemAdmin.objects.all()
    serializer_class = SystemAdminSerializer
    lookup_field = 'registr_no'


# ACADEMIC_PERSONEL
class AcademicPersonelListCreateView(ListCreateAPIView):
    queryset = AcademicPersonel.objects.all()
    serializer_class = AcademicPersonelSerializer

class AcademicPersonelDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AcademicPersonel.objects.all()
    serializer_class = AcademicPersonelSerializer
    lookup_field = 'registr_no'


# HIGH_ACADEMIC_GETS_SCORE (composite PK)
class HighAcademicGetsScoreListCreateView(ListCreateAPIView):
    queryset = HighAcademicGetsScore.objects.all()
    serializer_class = HighAcademicGetsScoreSerializer


# LOW_ACADEMIC
class LowAcademicListCreateView(ListCreateAPIView):
    queryset = LowAcademic.objects.all()
    serializer_class = LowAcademicSerializer

class LowAcademicDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LowAcademic.objects.all()
    serializer_class = LowAcademicSerializer
    lookup_field = 'registr_no'


# LOW_ACADEMIC_DUTY_EXTENDS (composite PK)
class LowAcademicDutyExtendsListCreateView(ListCreateAPIView):
    queryset = LowAcademicDutyExtends.objects.all()
    serializer_class = LowAcademicDutyExtendsSerializer
