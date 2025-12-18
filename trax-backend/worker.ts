import { getNextJob, markDone, markFailed } from "./src/repositories/job-dto";
import { triggerRepository } from "./src/repositories/triggers-dto";

async function startWorker() {
  console.log("Worker started");

  while (true) {
    const job = await getNextJob();

    if (!job) {
      await sleep(1000); // no busy loop
      continue;
    }

    try {
      const trigger = await triggerRepository.fetchTriggerById(job.triggerId);

      if (!trigger) {
        await markDone(job._id);
        continue;
      }

      // const price = await googleChat(trigger.config as any);
      // console.log("Fetched price:", price);

      await markDone(job._id);
      console.log("Job done");
    } catch (err) {
      await markFailed(job._id, err);
      console.error("Job failed", err);
    }
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

startWorker();
