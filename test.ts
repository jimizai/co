import { co } from ".";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

function* g() {
  yield sleep(1000);
  return 22;
}

co.exec(function* () {
  yield sleep(1000);
  console.log("22");
  const data = yield g;
  console.log("data");
  return data;
});
