import Foundation

struct QuizExport: Decodable {
    let schemaVersion: Int
    let counts: QuizCounts
    let questions: [QuizQuestion]
}

struct QuizCounts: Decodable {
    let total: Int
    let realImages: Int
    let placeholderImages: Int
    let multiSelect: Int
}

struct QuizQuestion: Decodable, Identifiable, Hashable {
    let id: String
    let category: String
    let prompt: String
    let answer: String
    let options: [String]
    let image: String?
    let answers: [String]?
    let multiSelect: Bool?
    let studyDirection: String?
    let reverseGroup: String?
    let explanation: String?

    var correctAnswers: Set<String> {
        Set(answers ?? [answer])
    }

    var isMultiSelect: Bool {
        multiSelect == true
    }
}

enum QuizDataLoader {
    static func load() throws -> QuizExport {
        guard let url = Bundle.main.url(forResource: "quiz-data", withExtension: "json") else {
            throw QuizDataError.missingBundleResource
        }

        let data = try Data(contentsOf: url)
        return try JSONDecoder().decode(QuizExport.self, from: data)
    }
}

enum QuizDataError: LocalizedError {
    case missingBundleResource

    var errorDescription: String? {
        switch self {
        case .missingBundleResource:
            "Could not find quiz-data.json in the app bundle."
        }
    }
}

