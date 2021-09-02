import { IOrganizerValue } from "../../../organizer/organizer-value";

export class SearchOrganizersRepoResponse {
    public organizers: IOrganizerValue[];
    public totalPages: number;
    public totalRecords: number;
}
