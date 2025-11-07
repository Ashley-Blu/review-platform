import { query } from "../config/database";
import { Application, NewApplication } from "../types/application.types";

export const createApplication = async (appData: NewApplication): Promise<Application> => {
    const {company_name, job_title, status} = appData
    const {rows} = await query("INSERT INTO applications (company_name, job_title, status) VALUES ($1, $2, $3) RETURNING *",
        [company_name, job_title, status]
    )
    return rows[0]; 
};


