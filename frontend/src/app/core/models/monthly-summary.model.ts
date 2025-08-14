interface MonthlySummary {
  year: number;
  month: number;
  monthName: string;
  totalDuration: number;
  totalWorkouts: number;
  avgIntensity: number;
  avgFatigue: number;
  weeklyProgress: WeeklyProgress[];
}
