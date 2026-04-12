import { Client, DatabaseAPI, DynamicGlobalProperties } from '@hiveio/dhive';

const DEFAULT_SERVER = [
  "https://api.openhive.network",
  'https://api.hive.blog'
];
const client = new Client(DEFAULT_SERVER, {
    timeout: 5000,
  })

const db = new DatabaseAPI(client);

export async function getGlobalProperties() {
  return await db.getDynamicGlobalProperties();
};

export function getAccount(account: string) {
  return db.getAccounts([account]);
}

export async function getHivePerMvest(global: DynamicGlobalProperties) {
  console.log(global);
  let total_vesting_fund_hive = parseFloat(
    global.total_vesting_fund_hive?.toString() ?? '0'
  );
  let total_vesting_shares = parseFloat(
    global.total_vesting_shares?.toString() ?? '0'
  );
  let hivePerMvest =
    total_vesting_fund_hive / (total_vesting_shares / 1000000);
  return hivePerMvest;
}

export async function vestsToHive(vests: number, global: DynamicGlobalProperties) {
  let hivePerMvest = await getHivePerMvest(global);
  let result = vests * parseFloat(hivePerMvest.toString()) / 1000000000;
  return result;
}