type Topic = {
  name: string,
  id: number
}

type CreateStudyNoteRequest = {
  title: string;
  topics: Array<Topic>;
  isPublic: boolean;
}
