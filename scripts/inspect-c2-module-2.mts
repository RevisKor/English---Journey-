import { getC2Lesson } from '../shared/course/c2';
for (let lessonNumber = 16; lessonNumber <= 30; lessonNumber += 1) {
  const lesson = getC2Lesson(lessonNumber);
  console.log(JSON.stringify({ lessonNumber, title: lesson?.title, titleArabic: lesson?.titleArabic, theme: lesson?.lexicalNetworks?.[0]?.theme, outcome: lesson?.learningPlan?.outcome?.canDo }));
}
