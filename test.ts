import { co } from ".";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

function* g() {
  console.log("g");
  yield sleep(1000);
  return 22;
}

co(function* () {
  console.log("22");
  yield sleep(1000);
  const data = yield g;
  console.log("data");
  return data;
});
