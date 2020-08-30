namespace App {
    // project type
    type Listener<T> = (items: T[]) => void;

    // Project state management
    class State<T> {
        protected listeners: Listener<T>[] = [];

        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    export class ProjectState extends State<Project> {
        private static instance: ProjectState;
        private projects: Project[] = [];

        private constructor() {
            super();
        }

        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }

        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(
                Math.random().toString(),
                title,
                description,
                numOfPeople,
                ProjectStatus.Active)
            this.projects.push(newProject);
            this.updateListeners();
        }

        moveProject(prjId: string, newStatus: ProjectStatus) {
            const project = this.projects.find(prj => prj.id === prjId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
            }
            this.updateListeners();
        }

        private updateListeners() {
            for (const listenersFn of this.listeners) {
                listenersFn(this.projects.slice());
            }
        }
    }

    export const projectState = ProjectState.getInstance();
}