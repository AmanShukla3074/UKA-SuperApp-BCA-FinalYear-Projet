from django_cron import CronJobBase, Schedule
from MusicStreaming.models import Artist_M

class MonthlyAnalyticsJob(CronJobBase):
    # Schedule the job to run at midnight on the 1st day of every month
    schedule = Schedule(run_at_times=['00:00'])
    # code = 'MusicStreaming.update_monthly_analytics_job'  # A unique code for the cron job
    # code = 'MusicStreaming.update_monthly_analytics_job'  # A unique code for the cron job
    code = 'monthly_analytics_job'

    def do(self):
        # Get all instances of YourModel and call the update_monthly_analytics method for each instance
        instances = Artist_M.objects.all()
        for instance in instances:
            instance.update_monthly_analytics()

