import { useState } from "react";
import { Box, Typography, IconButton, Grid, Button, Popover } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDate, setSelectedDate] = useState<number>(currentDay);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [yearRangeStart, setYearRangeStart] = useState(currentYear - (currentYear % 10));
  const [isSelectingYear, setIsSelectingYear] = useState<boolean>(false);
  const [isSelectingMonth, setIsSelectingMonth] = useState<boolean>(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const firstDayOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedYear, selectedMonth + offset, 1);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth());
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    onDateSelect(new Date(selectedYear, selectedMonth, day));
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsSelectingYear(false);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setIsSelectingMonth(false);
  };

  const openPopover = (event: React.MouseEvent<HTMLElement>, type: "year" | "month") => {
    setAnchorEl(event.currentTarget);
    setIsSelectingYear(type === "year");
    setIsSelectingMonth(type === "month");
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRadius: 2, overflow: "hidden" }}>
      {/* 연월 선택 헤더 */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <IconButton onClick={() => changeMonth(-1)} sx={{ color: "inherit", border: "none", "&:focus": { outline: "none" } }}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={(e) => openPopover(e, "year")}>
          {selectedYear}년
        </Typography>
        <Typography variant="h6" sx={{ cursor: "pointer", fontWeight: "bold", mx: 1 }} onClick={(e) => openPopover(e, "month")}>
          {selectedMonth + 1}월
        </Typography>
        <IconButton onClick={() => changeMonth(1)} sx={{ color: "inherit", border: "none", "&:focus": { outline: "none" } }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* 연도 & 월 선택 Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          {isSelectingYear ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <IconButton onClick={() => setYearRangeStart(yearRangeStart - 10)}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6">{yearRangeStart} - {yearRangeStart + 9}</Typography>
                <IconButton onClick={() => setYearRangeStart(yearRangeStart + 10)}>
                  <ChevronRight />
                </IconButton>
              </Box>

              <Grid container spacing={1}>
                {Array.from({ length: 10 }, (_, i) => yearRangeStart + i).map((year) => (
                  <Grid item key={year} xs={4}>
                    <Button
                      variant={year === selectedYear ? "contained" : "outlined"}
                      fullWidth
                      sx={{ aspectRatio: "1.5" }}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : isSelectingMonth ? (
            <>
              <Grid container spacing={1}>
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <Grid item key={month} xs={4}>
                    <Button
                      variant={month === selectedMonth ? "contained" : "outlined"}
                      fullWidth
                      sx={{ aspectRatio: "1.5" }}
                      onClick={() => handleMonthSelect(month)}
                    >
                      {month + 1}월
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : null}
        </Box>
      </Popover>

      {/* 요일 헤더 */}
      <Grid container sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
        {weekDays.map((day, index) => (
          <Grid item key={day} xs={1.71}>
            <Typography align="center" sx={{ fontSize: "0.8rem", fontWeight: "normal", color: index === 0 ? "error.main" : index === 6 ? "primary.main" : "text.primary" }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* 달력 */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Grid container spacing={1}>
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <Grid item key={`empty-${i}`} xs={1.71}>
              <Box sx={{ aspectRatio: "1", p: 1 }} />
            </Grid>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const isToday = selectedYear === currentYear && selectedMonth === currentMonth && day === currentDay;
            const isSelected = selectedDate === day;
            return (
              <Grid item key={day} xs={1.71}>
                <Box
                  onClick={() => handleDateSelect(day)}
                  sx={{
                    aspectRatio: "1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor: isSelected ? "primary.light" : isToday ? "secondary.light" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Typography variant="body2">{day}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Calendar;
