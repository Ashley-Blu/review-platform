import { query } from "../config/database";
import {
  Users,
  NewUser,
  NewProject,
  Projects,
  NewSubmissions,
  Submissions,
  NewComments,
  Comments,
} from "../types/platform.types";

export const createUser = async (appData: NewUser): Promise<Users> => {
  const { username, email, password } = appData;
  const { rows } = await query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return rows[0];
};

export const createProjects = async (
  appData: NewProject
): Promise<Projects> => {
  const { user_id, title, description } = appData;
  const { rows } = await query(
    "INNSERT INTO projects (user_id, title, password) VALUES ($1, $2, $3) RETURNING *",
    [user_id, title, description]
  );
  return rows[0];
};

export const createSubmissions = async (
  appData: NewSubmissions
): Promise<Submissions> => {
  const { project_id, user_id, content } = appData;
  const { rows } = await query(
    "INNSERT INTO submissions (project_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [project_id, user_id, content]
  );
  return rows[0];
};

export const createComments = async (
  appData: NewComments
): Promise<Comments> => {
  const { submission_id, user_id, content } = appData;
  const { rows } = await query(
    "INNSERT INTO comments (submission_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [submission_id, user_id, content]
  );
  return rows[0];
};
