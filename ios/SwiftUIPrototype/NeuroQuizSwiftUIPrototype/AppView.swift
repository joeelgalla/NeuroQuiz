import SwiftUI
import UIKit

struct AppView: View {
    @State private var loadState: LoadState = .loading

    var body: some View {
        NavigationStack {
            Group {
                switch loadState {
                case .loading:
                    ProgressView("Loading quiz data")
                case .loaded(let export):
                    CategoryListView(export: export)
                case .failed(let message):
                    ContentUnavailableView("Could not load quiz data", systemImage: "exclamationmark.triangle", description: Text(message))
                }
            }
            .navigationTitle("NeuroQuiz")
        }
        .task {
            loadState = loadQuizData()
        }
    }

    private func loadQuizData() -> LoadState {
        do {
            return .loaded(try QuizDataLoader.load())
        } catch {
            return .failed(error.localizedDescription)
        }
    }
}

private enum LoadState {
    case loading
    case loaded(QuizExport)
    case failed(String)
}

struct CategoryListView: View {
    let export: QuizExport

    private var categories: [String] {
        let preferred = ["Myotome", "Dermatome", "Nerve Root", "Brain Region"]
        let available = Set(export.questions.map(\.category))
        return preferred.filter { available.contains($0) }
    }

    var body: some View {
        List {
            Section {
                ForEach(categories, id: \.self) { category in
                    NavigationLink {
                        QuizFlowView(category: category, questions: export.questions.filter { $0.category == category })
                    } label: {
                        Label {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(categoryTitle(category))
                                    .font(.headline)
                                Text("\(export.questions.filter { $0.category == category }.count) questions")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        } icon: {
                            Image(systemName: symbolName(for: category))
                                .foregroundStyle(symbolColor(for: category))
                        }
                    }
                }
            } header: {
                Text("Study Areas")
            }

            Section("Export") {
                LabeledContent("Questions", value: "\(export.counts.total)")
                LabeledContent("Real images", value: "\(export.counts.realImages)")
                LabeledContent("Placeholder images", value: "\(export.counts.placeholderImages)")
                LabeledContent("Multi-select", value: "\(export.counts.multiSelect)")
            }
        }
    }
}

struct QuizFlowView: View {
    let category: String
    let questions: [QuizQuestion]

    @State private var currentIndex = 0
    @State private var score = 0
    @State private var missed: [QuizQuestion] = []
    @State private var selectedAnswers: Set<String> = []
    @State private var submitted = false
    @State private var finished = false

    private var currentQuestion: QuizQuestion? {
        questions.indices.contains(currentIndex) ? questions[currentIndex] : nil
    }

    var body: some View {
        VStack(spacing: 18) {
            if finished {
                ContentUnavailableView {
                    Label("Round Complete", systemImage: "checkmark.seal")
                } description: {
                    Text("Score \(score) / \(questions.count). Missed \(missed.count).")
                } actions: {
                    Button("Start Again") {
                        restart()
                    }
                    .buttonStyle(.borderedProminent)
                }
            } else if let question = currentQuestion {
                ProgressView(value: Double(currentIndex), total: Double(max(questions.count, 1)))
                    .tint(.indigo)

                HStack {
                    Label("\(score)", systemImage: "checkmark.circle")
                        .font(.headline)
                        .foregroundStyle(.green)
                    Label("\(missed.count)", systemImage: "xmark.circle")
                        .font(.headline)
                        .foregroundStyle(.red)
                    Spacer()
                    Text("\(currentIndex + 1) / \(questions.count)")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.secondary)
                }

                BundleImage(path: question.image)
                    .frame(maxHeight: 220)

                VStack(spacing: 8) {
                    Text(question.prompt)
                        .font(.title2.bold())
                        .multilineTextAlignment(.center)

                    if question.isMultiSelect {
                        Text("Select all correct actions")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(.purple)
                    }
                }

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(question.options, id: \.self) { option in
                        AnswerButton(
                            title: option,
                            isSelected: selectedAnswers.contains(option),
                            isCorrect: question.correctAnswers.contains(option),
                            submitted: submitted,
                            action: { handleSelection(option, question: question) }
                        )
                    }
                }

                if question.isMultiSelect && !submitted {
                    Button("Confirm Selection") {
                        submit(question)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(selectedAnswers.isEmpty)
                }

                if submitted {
                    VStack(spacing: 10) {
                        Text(isCurrentQuestionCorrect(question) ? "Correct" : "Correct answer: \(question.correctAnswers.sorted().joined(separator: ", "))")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(isCurrentQuestionCorrect(question) ? .green : .red)
                            .multilineTextAlignment(.center)

                        Button(currentIndex + 1 == questions.count ? "Finish" : "Next Question") {
                            advance()
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            } else {
                ContentUnavailableView("No questions", systemImage: "questionmark.circle")
            }
        }
        .padding()
        .navigationTitle(categoryTitle(category))
        .navigationBarTitleDisplayMode(.inline)
    }

    private func handleSelection(_ option: String, question: QuizQuestion) {
        guard !submitted else { return }
        if question.isMultiSelect {
            if selectedAnswers.contains(option) {
                selectedAnswers.remove(option)
            } else {
                selectedAnswers.insert(option)
            }
        } else {
            selectedAnswers = [option]
            submit(question)
        }
    }

    private func submit(_ question: QuizQuestion) {
        submitted = true
        if isCurrentQuestionCorrect(question) {
            score += 1
        } else {
            missed.append(question)
        }
    }

    private func advance() {
        selectedAnswers = []
        submitted = false
        if currentIndex + 1 < questions.count {
            currentIndex += 1
        } else {
            finished = true
        }
    }

    private func restart() {
        currentIndex = 0
        score = 0
        missed = []
        selectedAnswers = []
        submitted = false
        finished = false
    }

    private func isCurrentQuestionCorrect(_ question: QuizQuestion) -> Bool {
        selectedAnswers == question.correctAnswers
    }
}

struct AnswerButton: View {
    let title: String
    let isSelected: Bool
    let isCorrect: Bool
    let submitted: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity, minHeight: 68)
                .padding(10)
        }
        .buttonStyle(.plain)
        .background(background)
        .foregroundStyle(foreground)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(border, lineWidth: 2)
        }
    }

    private var background: Color {
        if submitted {
            if isCorrect { return .green.opacity(0.18) }
            if isSelected { return .red.opacity(0.18) }
            return .secondary.opacity(0.08)
        }
        return isSelected ? .indigo.opacity(0.16) : .secondary.opacity(0.08)
    }

    private var foreground: Color {
        if submitted {
            if isCorrect { return .green }
            if isSelected { return .red }
        }
        return isSelected ? .indigo : .primary
    }

    private var border: Color {
        if submitted {
            if isCorrect { return .green }
            if isSelected { return .red }
            return .clear
        }
        return isSelected ? .indigo : .clear
    }
}

struct BundleImage: View {
    let path: String?

    var body: some View {
        if let image = loadImage() {
            Image(uiImage: image)
                .resizable()
                .scaledToFit()
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        } else {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(.secondary.opacity(0.1))
                .overlay {
                    Label("Text only", systemImage: "textformat")
                        .font(.headline)
                        .foregroundStyle(.secondary)
                }
        }
    }

    private func loadImage() -> UIImage? {
        guard let path else { return nil }
        let relativePath = path.hasPrefix("/") ? String(path.dropFirst()) : path
        guard let resourceRoot = Bundle.main.resourcePath else { return nil }
        return UIImage(contentsOfFile: URL(fileURLWithPath: resourceRoot).appending(path: relativePath).path)
    }
}

private func categoryTitle(_ category: String) -> String {
    category == "Nerve Root" ? "Peripheral Nerves" : category
}

private func symbolName(for category: String) -> String {
    switch category {
    case "Myotome":
        "figure.strengthtraining.traditional"
    case "Dermatome":
        "bolt.heart"
    case "Nerve Root":
        "point.3.connected.trianglepath.dotted"
    case "Brain Region":
        "brain.head.profile"
    default:
        "questionmark.circle"
    }
}

private func symbolColor(for category: String) -> Color {
    switch category {
    case "Myotome":
        .green
    case "Dermatome":
        .cyan
    case "Nerve Root":
        .purple
    case "Brain Region":
        .orange
    default:
        .secondary
    }
}
