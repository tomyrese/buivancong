import { CourseService, Course } from './courseService';

export interface AIRecommendationResult {
  recommendedCourses: Course[];
  explanation: string;
  matchedKeywords: string[];
}

export const AIService = {
  recommendCourses: (prompt: string): AIRecommendationResult => {
    const courses = CourseService.getCourses();
    const query = prompt.toLowerCase().trim();
    
    const matchedCourseIds = new Set<string>();
    const matchedKeywords: string[] = [];
    
    // Keyword rules mapping for competency assessment prep
    const rules = [
      {
        keywords: ['vật lý', 'vật lí', 'nhiệt học', 'lí', 'nhiệt độ'],
        courseIds: ['physics-12'],
        keywordName: 'Vật lý 12'
      },
      {
        keywords: ['sinh học', 'sinh', 'di truyền', 'phả hệ', 'nhiễm sắc thể', 'dna'],
        courseIds: ['biology-12'],
        keywordName: 'Sinh học 12'
      },
      {
        keywords: ['lịch sử', 'sử', 'asean', 'chiến tranh lạnh', 'ianta'],
        courseIds: ['history-12'],
        keywordName: 'Lịch sử 12'
      },
      {
        keywords: ['hóa học', 'hóa', 'este', 'lipit', 'xà phòng'],
        courseIds: ['chemistry-12'],
        keywordName: 'Hóa học 12'
      },
      {
        keywords: ['pháp luật', 'kinh tế', 'luật', 'công dân', 'gdcd'],
        courseIds: ['economy-law-12'],
        keywordName: 'Kinh tế & Pháp luật 12'
      },
      {
        keywords: ['địa lý', 'địa lí', 'địa', 'atlat', 'khí hậu', 'tự nhiên'],
        courseIds: ['geography-12'],
        keywordName: 'Địa lý 12'
      },
      {
        keywords: ['toán 10', 'lớp 10', 'mệnh đề', 'tập hợp'],
        courseIds: ['math-10'],
        keywordName: 'Toán học 10'
      },
      {
        keywords: ['toán 11', 'lớp 11', 'lượng giác', 'tổ hợp', 'xác suất'],
        courseIds: ['math-11'],
        keywordName: 'Toán học 11'
      },
      {
        keywords: ['toán 12', 'lớp 12', 'đạo hàm', 'khảo sát', 'cực trị', 'số phức', 'tích phân'],
        courseIds: ['math-12'],
        keywordName: 'Toán học 12'
      },
      {
        keywords: ['toán', 'toán học', 'định lượng'],
        courseIds: ['math-10', 'math-11', 'math-12'],
        keywordName: 'Tư duy định lượng (Toán)'
      },
      {
        keywords: ['suy luận khoa học', 'khoa học', 'tự nhiên', 'xã hội'],
        courseIds: ['physics-12', 'biology-12', 'history-12', 'chemistry-12', 'economy-law-12', 'geography-12'],
        keywordName: 'Suy luận Khoa học'
      }
    ];

    rules.forEach(rule => {
      const match = rule.keywords.some(keyword => query.includes(keyword));
      if (match) {
        rule.courseIds.forEach(id => matchedCourseIds.add(id));
        matchedKeywords.push(rule.keywordName);
      }
    });

    let recommended: Course[] = [];
    let explanation = '';

    if (matchedCourseIds.size > 0) {
      recommended = courses.filter(c => matchedCourseIds.has(c.id));
      explanation = `Dựa trên yêu cầu ôn luyện về **${matchedKeywords.join(', ')}** của bạn, thầy Bùi Văn Công đề xuất các khóa học chuyên đề tối ưu dưới đây để bạn đạt kết quả cao nhất trong kỳ thi ĐGNL sắp tới.`;
    } else {
      // Recommend featured courses
      recommended = courses.filter(c => c.isFeatured);
      explanation = `Tôi chưa nhận diện được môn học cụ thể nào trong câu hỏi của bạn. Dưới đây là các khóa học chuyên đề ĐGNL tiêu biểu của thầy Bùi Văn Công mà bạn nên tham gia!`;
    }

    return {
      recommendedCourses: recommended,
      explanation,
      matchedKeywords
    };
  }
};
