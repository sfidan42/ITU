from django.urls import path
from . import views
from . import views_combined

urlpatterns = [
    path('api/person/', views.PersonListCreateView.as_view()),
    path('api/person/<str:tc_no>/', views.PersonDetailView.as_view()),

    path('api/personel/', views.PersonelListCreateView.as_view()),
    path('api/personel/<int:registr_no>/', views.PersonelDetailView.as_view()),

    path('api/language-compensation-score/', views.LanguageCompensationScoreListCreateView.as_view()),
    path('api/personel-gets-langcompensscore/', views.PersonelGetsLangCompensScoreListCreateView.as_view()),

    path('api/management-staff/', views.ManagementStaffListCreateView.as_view()),
    path('api/management-staff/<int:registr_no>/', views.ManagementStaffDetailView.as_view()),

    path('api/promotion/', views.PromotionListCreateView.as_view()),
    path('api/promotion/<int:prom_id>/', views.PromotionDetailView.as_view()),

    path('api/management-staff-gets-prom/', views.ManagementStaffGetsPromListCreateView.as_view()),

    path('api/system-admin/', views.SystemAdminListCreateView.as_view()),
    path('api/system-admin/<int:registr_no>/', views.SystemAdminDetailView.as_view()),

    path('api/academic-personel/', views.AcademicPersonelListCreateView.as_view()),
    path('api/academic-personel/<int:registr_no>/', views.AcademicPersonelDetailView.as_view()),

    path('api/high-academic-gets-score/', views.HighAcademicGetsScoreListCreateView.as_view()),

    path('api/low-academic/', views.LowAcademicListCreateView.as_view()),
    path('api/low-academic/<int:registr_no>/', views.LowAcademicDetailView.as_view()),

    path('api/low-academic-duty-extends/', views.LowAcademicDutyExtendsListCreateView.as_view()),
]

urlpatterns += [

    # Base
    path('api/combined/person-overview/', views_combined.CombinedPersonView.as_view()),

    # Academic general
    path('api/combined/academic-staff/', views_combined.CombinedAcademicStaffView.as_view()),
    # Academic subtypes
    path('api/combined/academic-staff/research-assistant/', views_combined.CombinedResearchAssistantView.as_view()),
    path('api/combined/academic-staff/instructor/', views_combined.CombinedInstructorView.as_view()),
    path('api/combined/academic-staff/doctor-lecturer/', views_combined.CombinedDoctorLecturerView.as_view()),
    path('api/combined/academic-staff/associate-professor/', views_combined.CombinedAssociateProfessorView.as_view()),
    path('api/combined/academic-staff/professor/', views_combined.CombinedProfessorView.as_view()),

    # Administrative and system
    path('api/combined/administrative-staff/', views_combined.CombinedAdministrativeStaffView.as_view()),
]

