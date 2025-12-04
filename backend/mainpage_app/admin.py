from django.contrib import admin
from .models import (
    Person, Personel, PersonelGetsLangCompensScore,
    LanguageCompensationScore, ManagementStaff, ManagementStaffGetsProm,
    Promotion, SystemAdmin, AcademicPersonel,
    HighAcademicGetsScore, LowAcademic, LowAcademicDutyExtends
)

admin.site.register(Person)
admin.site.register(Personel)
admin.site.register(PersonelGetsLangCompensScore)
admin.site.register(LanguageCompensationScore)
admin.site.register(ManagementStaff)
admin.site.register(ManagementStaffGetsProm)
admin.site.register(Promotion)
admin.site.register(SystemAdmin)
admin.site.register(AcademicPersonel)
admin.site.register(HighAcademicGetsScore)
admin.site.register(LowAcademic)
admin.site.register(LowAcademicDutyExtends)
