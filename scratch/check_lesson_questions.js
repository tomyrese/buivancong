const fs = require('fs');
const path = require('path');

// Mock CourseService logic
const physics12 = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/courses/scientific_reasoning/physics12.json'), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/lessons.json'), 'utf8'));

const courseLessons = lessons.filter(l => l.courseId === 'physics-12').sort((a, b) => a.order - b.order);

// Collect multiple choice questions
const rawQuestions = [];
const collectQuestions = (topics) => {
  topics.forEach((t) => {
    if (t.questions && Array.isArray(t.questions)) {
      t.questions.forEach((q) => {
        if (q.type === 'multiple_choice') {
          rawQuestions.push(q);
        }
      });
    }
    if (t.subtopics && Array.isArray(t.subtopics)) {
      collectQuestions(t.subtopics);
    }
  });
};

physics12.chapters.forEach((ch) => {
  if (ch.topics) {
    collectQuestions(ch.topics);
  }
});

console.log(`Total MCQ questions in physics12.json: ${rawQuestions.length}`);

courseLessons.forEach((lesson, index) => {
  const totalQuestions = rawQuestions.length;
  const totalLessons = courseLessons.length;
  
  const questionsPerLesson = Math.max(1, Math.ceil(totalQuestions / totalLessons));
  const startIdx = index * questionsPerLesson;
  const endIdx = Math.min(totalQuestions, startIdx + questionsPerLesson);

  const lessonQuestions = rawQuestions.slice(startIdx, endIdx);
  
  console.log(`\nLesson: ${lesson.title} (${lesson.id})`);
  console.log(`Questions count: ${lessonQuestions.length}`);
  console.log(`First Question: ${lessonQuestions[0]?.question}`);
  console.log(`Last Question: ${lessonQuestions[lessonQuestions.length - 1]?.question}`);
});
