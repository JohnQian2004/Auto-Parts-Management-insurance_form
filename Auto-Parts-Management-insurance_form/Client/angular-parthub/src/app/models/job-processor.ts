export class JobProcessor {

    jobDescriptions = ['Started', 'Uploaded', 'Done', 'Notified', 'Verified'];

    getStepDescription(points: number): string {
        const index = Math.min(Math.floor(points / 20), this.jobDescriptions.length - 1);
        return this.jobDescriptions[index];
    }

    getCumulativeStepDescription(points: number): string {
        const stepsCount = Math.min(Math.floor(points / 20), this.jobDescriptions.length);
        const cumulativeDescriptions = this.jobDescriptions.slice(0, stepsCount);
        return cumulativeDescriptions.join(' -> ');
    }

    getNextStepDescription(points: number): string | null {
        const currentStepIndex = Math.min(Math.floor(points / 20), this.jobDescriptions.length - 1);

        if (currentStepIndex === this.jobDescriptions.length - 1) {
            return null; // No next step available
        }

        return this.jobDescriptions[currentStepIndex + 1];
    }
}

 
