import { TimePickerType } from '@/types/create';

// ISO 문자열에서 '월 일 (요일)' 형식으로 변환
export function formatDateWithDay(isoString: string): string {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 요일 구하기
  const days = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
  const dayOfWeek = days[date.getDay()];

  return `${month}월 ${day}일 ${dayOfWeek}`;
}

// ISO 문자열에서 '오전/오후 시:분' 형식으로 변환 (바텀시트용)
export function formatTimeForDetail(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? '오후' : '오전';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${period} ${hours}:${minutes.toString().padStart(2, '0')}`;
}

// ISO 문자열에서 '오전/오후 시시까지' 형식으로 변환 (리스트용)
export function formatTimeForList(
  isoString: string,
  includeToday = true,
): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? '오후' : '오전';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  // 자정인 경우 특별 처리
  if (hours === 12 && minutes === 0 && period === '오전') {
    return includeToday ? '오늘 자정까지' : '자정까지';
  }

  // 분이 0인 경우는 시간만, 아닌 경우는 분까지 표시
  const timeStr =
    minutes === 0
      ? `${period} ${hours}시까지`
      : `${period} ${hours}시 ${minutes}분까지`;

  return includeToday ? `오늘 ${timeStr}` : timeStr;
}

// 오늘인지 판별
export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// 날짜 문자열 (YYYY-MM-DD) 및 시간 문자열에서 Date 객체 생성
export function parseDateAndTime(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr);

  let hours = 0;
  if (timeStr.includes('오후')) {
    const match = timeStr.match(/오후\s*(\d+)시/);
    if (match && match[1]) {
      hours = parseInt(match[1]);
      if (hours !== 12) hours += 12;
    }
  } else if (timeStr.includes('오전')) {
    const match = timeStr.match(/오전\s*(\d+)시/);
    if (match && match[1]) {
      hours = parseInt(match[1]);
      if (hours === 12) hours = 0;
    }
  } else if (timeStr.includes('자정')) {
    hours = 0;
  }

  date.setHours(hours, 0, 0, 0);
  return date;
}

// 남은 시간 계산하여 문자열 반환
export function calculateRemainingTime(targetDate: Date): string {
  const now = new Date().getTime();
  const timeLeft = targetDate.getTime() - now;

  if (timeLeft <= 0) return '00:00:00 남음';

  // 24시간(1일) 이상인 경우 일, 시간, 분 형식으로 표시
  if (timeLeft >= 24 * 60 * 60 * 1000) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}일 ${h}시간 ${m}분 남음`;
  } else {
    // 24시간 미만인 경우 시:분:초 형식으로 표시
    const h = Math.floor(timeLeft / (1000 * 60 * 60));
    const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} 남음`;
  }
}

/**
 * "2025-03-05T16:00:00" → "3월 5일 (수) 오후 04:00"
 *
 * @param isoString - ISO 형식의 날짜/시간 문자열
 * @returns "M월 d일 (요일) 오전/오후 hh:mm" 형태의 문자열
 */
export function formatKoreanDateTime(isoString: string): string {
  const date = new Date(isoString);

  // 요일 표기를 위한 배열
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = dayNames[date.getDay()];

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? '오전' : '오후';

  // 12시간제로 변환
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 분이 한 자리 수일 때 앞에 0을 붙임
  const minuteStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${month}월 ${day}일 (${dayOfWeek}) ${ampm} ${hours}:${minuteStr}`;
}

/**
 * 주어진 ISO 시간(미래 시각)으로부터 현재까지 남은 시간을
 * "HH시간 MM분 SS초" 형식으로 반환합니다.
 *
 * @param isoString ISO 8601 형식의 날짜/시간 문자열 (예: "2025-03-05T16:00:00")
 * @returns 남은 시간 "HH시간 MM분 SS초" (만약 이미 시간이 지났다면 "00시간 00분 00초")
 */
export function getRemainingTime(isoString: string): string {
  const now = new Date();
  const target = new Date(isoString);

  let diff = target.getTime() - now.getTime();

  // 이미 시간이 지났다면 0으로 처리
  if (diff < 0) {
    diff = 0;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

export function combineDeadlineDateTime(
  date: Date,
  time: TimePickerType,
): string {
  let hour24 = parseInt(time.hour, 10);
  if (time.meridiem === '오전') {
    if (hour24 === 12) hour24 = 0;
  } else {
    if (hour24 !== 12) {
      hour24 += 12;
    }
  }

  const combinedDate = new Date(date);
  combinedDate.setHours(hour24, parseInt(time.minute, 10), 0, 0);
  return combinedDate.toISOString();
}
