from django.db import models

class Person(models.Model):
    tc_no = models.CharField(max_length=11, primary_key=True)
    name = models.CharField(max_length=255)
    mid_name = models.CharField(max_length=255, blank=True, null=True)
    surname = models.CharField(max_length=255)
    personal_mail = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'person'


class Personel(models.Model):
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        default=1  # or another valid Person ID that exists
    )
    itu_mail = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    registration_date = models.DateField()
    status = models.CharField(max_length=50)

    class Meta:
        db_table = 'personel'


class LanguageCompensationScore(models.Model):
    lang_comp_id = models.IntegerField(primary_key=True)
    letter_score = models.CharField(max_length=1)

    class Meta:
        db_table = 'language_compensation_score'


class PersonelGetsLangCompensScore(models.Model):
    registr_no = models.ForeignKey(Personel, on_delete=models.CASCADE, related_name='lang_scores')
    date = models.DateField()
    lang_comp_id = models.ForeignKey(LanguageCompensationScore, on_delete=models.CASCADE, related_name='personel_scores')

    class Meta:
        db_table = 'personel_gets_langcompensscore'
        unique_together = (('registr_no', 'date'),)


class ManagementStaff(models.Model):
    registr_no = models.OneToOneField(Personel, primary_key=True, on_delete=models.CASCADE, related_name='management_staff')
    title = models.CharField(max_length=255)

    class Meta:
        db_table = 'management_staff'


class Promotion(models.Model):
    prom_id = models.IntegerField(primary_key=True)
    date = models.DateField()
    next_date = models.DateField()
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'promotion'


class ManagementStaffGetsProm(models.Model):
    registr_no = models.ForeignKey(
        ManagementStaff,
        on_delete=models.CASCADE,
        related_name='promotions'  # <-- add this
    )
    prom_id = models.ForeignKey(Promotion, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'management_staff_gets_prom'
        unique_together = (('registr_no', 'prom_id'),)


class SystemAdmin(models.Model):
    registr_no = models.OneToOneField(Personel, primary_key=True, on_delete=models.CASCADE, related_name='system_admin')
    user_name = models.CharField(max_length=255)
    encrypted_password = models.CharField(max_length=255)

    class Meta:
        db_table = 'system_admin'


class AcademicPersonel(models.Model):
    registr_no = models.OneToOneField(Personel, primary_key=True, on_delete=models.CASCADE, related_name='academic_personel')
    duty_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'academic_personel'


class HighAcademicGetsScore(models.Model):
    registr_no = models.ForeignKey(AcademicPersonel, on_delete=models.CASCADE, related_name='high_scores')
    score_date = models.DateField()
    score_type = models.CharField(max_length=50)

    class Meta:
        db_table = 'high_academic_gets_score'
        unique_together = (('registr_no', 'score_date'),)


class LowAcademic(models.Model):
    registr_no = models.OneToOneField(AcademicPersonel, primary_key=True, on_delete=models.CASCADE, related_name='low_academic')
    last_duty_ext_date = models.DateField()

    class Meta:
        db_table = 'low_academic'


class LowAcademicDutyExtends(models.Model):
    registr_no = models.ForeignKey(LowAcademic, on_delete=models.CASCADE, related_name='duty_extends')
    ext_date = models.DateField()
    next_ext_date = models.DateField()

    class Meta:
        db_table = 'low_academic_duty_extends'
        unique_together = (('registr_no', 'ext_date'),)
