/**
 * Curriculum Save Queue
 * Prevents race conditions by ensuring only one curriculum save happens at a time
 * Both experienceStore and projectStore use this queue
 */

type SaveOperation = () => Promise<void>;

class CurriculumSaveQueue {
  private queue: SaveOperation[] = [];
  private isProcessing: boolean = false;

  /**
   * Add a save operation to the queue
   * If no operation is currently processing, start immediately
   */
  async enqueue(operation: SaveOperation): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await operation();
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the queue sequentially
   * Each operation waits for the previous one to complete
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const operation = this.queue.shift();

    if (operation) {
      try {
        await operation();
      } catch (error) {
        console.error('Save queue operation failed:', error);
      }
    }

    // Process next operation
    this.processQueue();
  }
}

// Singleton instance shared by all stores
export const curriculumSaveQueue = new CurriculumSaveQueue();
