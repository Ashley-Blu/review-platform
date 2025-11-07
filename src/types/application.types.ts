export type ApplicationStatus = "Applied" | "Pending" | "Rejected" | "Offer";

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  status: ApplicationStatus;
  applied_at: Date;
};

export type NewApplication = Omit<Application, 'id' | 'applied_at'> //postgreSQL creates the 2 first fields

export type upDateApplication = Pick<Application, 'status'>
