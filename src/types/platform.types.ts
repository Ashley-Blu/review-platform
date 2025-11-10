export interface Users {
  id: Number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
};

export interface Projects {
  id: Number;
  user_id: Number;
  title: string;
  description: string;
  created_at: Date;
};

export interface Submissions {
  id: Number;
  project_id: Number;
  user_id: Number;
  content: string;
  submitted_date: Date;
};

export interface Comments {
  id: Number;
  submission_id: Number;
  user_id: Number;
  content: string;
  created_at: Date;
};

export type NewUser = Omit<Users, 'id' | 'created_at'> //postgreSQL creates the 2 first fields
export type NewProject = Omit<Projects, 'id' | 'created_at'> 
export type NewSubmissions = Omit<Submissions, 'id' | 'submitted_at'> 
export type NewComments = Omit<Comments, 'id' | 'created_at'> 