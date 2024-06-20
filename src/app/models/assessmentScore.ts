export class AssessmentScore {
  id: number;
  assessmentId: number;
  traineeId: number;
  score: number;

  constructor(
    id: number,
    assessmentId: number,
    traineeId: number,
    score: number
  ) {
    this.id = id;
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.score = score;
  }
}
