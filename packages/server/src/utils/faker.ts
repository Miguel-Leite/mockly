import { faker } from '@faker-js/faker';

type FakerMethod = string;

const fakerFunctions: Record<FakerMethod, () => any> = {
  // Simple aliases
  name: () => faker.person.fullName(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  email: () => faker.internet.email(),
  phone: () => faker.phone.number(),
  uuid: () => faker.string.uuid(),
  boolean: () => faker.datatype.boolean(),
  number: () => faker.number.int({ min: 1, max: 1000 }),
  date: () => faker.date.recent().toISOString(),
  word: () => faker.lorem.word(),
  sentence: () => faker.lorem.sentence(),
  paragraph: () => faker.lorem.paragraph(),
  city: () => faker.location.city(),
  country: () => faker.location.country(),
  street: () => faker.location.streetAddress(),
  url: () => faker.internet.url(),
  avatar: () => faker.image.avatar(),
  company: () => faker.company.name(),

  // Person module
  'person.fullName': () => faker.person.fullName(),
  'person.firstName': () => faker.person.firstName(),
  'person.lastName': () => faker.person.lastName(),
  'person.middleName': () => faker.person.middleName(),
  'person.prefix': () => faker.person.prefix(),
  'person.suffix': () => faker.person.suffix(),
  'person.gender': () => faker.person.gender(),
  'person.sex': () => faker.person.sex(),
  'person.bio': () => faker.person.bio(),
  'person.jobTitle': () => faker.person.jobTitle(),
  'person.jobDescriptor': () => faker.person.jobDescriptor(),
  'person.jobArea': () => faker.person.jobArea(),
  'person.jobType': () => faker.person.jobType(),

  // Internet module
  'internet.email': () => faker.internet.email(),
  'internet.username': () => faker.internet.username(),
  'internet.password': () => faker.internet.password(),
  'internet.url': () => faker.internet.url(),
  'internet.domainName': () => faker.internet.domainName(),
  'internet.domainWord': () => faker.internet.domainWord(),
  'internet.domainSuffix': () => faker.internet.domainSuffix(),
  'internet.ip': () => faker.internet.ip(),
  'internet.ipv4': () => faker.internet.ipv4(),
  'internet.ipv6': () => faker.internet.ipv6(),
  'internet.mac': () => faker.internet.mac(),
  'internet.userAgent': () => faker.internet.userAgent(),
  'internet.protocol': () => faker.internet.protocol(),
  'internet.httpStatusCode': () => faker.internet.httpStatusCode(),
  'internet.httpMethod': () => faker.internet.httpMethod(),
  'internet.exampleEmail': () => faker.internet.exampleEmail(),
  'internet.displayName': () => faker.internet.displayName(),
  'internet.emoji': () => faker.internet.emoji(),

  // Location module
  'location.city': () => faker.location.city(),
  'location.country': () => faker.location.country(),
  'location.countryCode': () => faker.location.countryCode(),
  'location.street': () => faker.location.streetAddress(),
  'location.streetAddress': () => faker.location.streetAddress(),
  'location.state': () => faker.location.state(),
  'location.zipCode': () => faker.location.zipCode(),
  'location.latitude': () => faker.location.latitude(),
  'location.longitude': () => faker.location.longitude(),
  'location.timeZone': () => faker.location.timeZone(),
  'location.buildingNumber': () => faker.location.buildingNumber(),

  // Date module
  'date.past': () => faker.date.past().toISOString(),
  'date.future': () => faker.date.future().toISOString(),
  'date.recent': () => faker.date.recent().toISOString(),
  'date.soon': () => faker.date.soon().toISOString(),
  'date.birthdate': () => faker.date.birthdate().toISOString(),
  'date.anytime': () => faker.date.anytime().toISOString(),
  'date.month': () => faker.date.month(),
  'date.weekday': () => faker.date.weekday(),

  // Lorem module
  'lorem.word': () => faker.lorem.word(),
  'lorem.words': () => faker.lorem.words(),
  'lorem.sentence': () => faker.lorem.sentence(),
  'lorem.sentences': () => faker.lorem.sentences(),
  'lorem.paragraph': () => faker.lorem.paragraph(),
  'lorem.paragraphs': () => faker.lorem.paragraphs(),
  'lorem.slug': () => faker.lorem.slug(),
  'lorem.lines': () => faker.lorem.lines(),

  // Number module
  'number.int': () => faker.number.int(),
  'number.float': () => faker.number.float(),
  'number.binary': () => faker.number.binary(),
  'number.octal': () => faker.number.octal(),
  'number.hex': () => faker.number.hex(),
  'number.romanNumeral': () => faker.number.romanNumeral(),

  // String module
  'string.uuid': () => faker.string.uuid(),
  'string.alpha': () => faker.string.alpha(),
  'string.alphanumeric': () => faker.string.alphanumeric(),
  'string.numeric': () => faker.string.numeric(),
  'string.symbol': () => faker.string.symbol(),
  'string.sample': () => faker.string.sample(),

  // Datatype module
  'datatype.boolean': () => faker.datatype.boolean(),
  'datatype.int': () => faker.number.int(),
  'datatype.float': () => faker.number.float(),
  'datatype.string': () => faker.string.sample(),
  'datatype.json': () => JSON.stringify({ key: faker.string.sample() }),
  'datatype.bigInt': () => faker.number.bigInt().toString(),
  'datatype.hexadecimal': () => faker.string.hexadecimal(),

  // Commerce module
  'commerce.productName': () => faker.commerce.productName(),
  'commerce.price': () => faker.commerce.price(),
  'commerce.department': () => faker.commerce.department(),
  'commerce.productAdjective': () => faker.commerce.productAdjective(),
  'commerce.productMaterial': () => faker.commerce.productMaterial(),
  'commerce.product': () => faker.commerce.product(),

  // Finance module
  'finance.accountNumber': () => faker.finance.accountNumber(),
  'finance.iban': () => faker.finance.iban(),
  'finance.bic': () => faker.finance.bic(),
  'finance.currencyCode': () => faker.finance.currencyCode(),
  'finance.currencyName': () => faker.finance.currencyName(),
  'finance.currencySymbol': () => faker.finance.currencySymbol(),
  'finance.bitcoinAddress': () => faker.finance.bitcoinAddress(),
  'finance.ethereumAddress': () => faker.finance.ethereumAddress(),
  'finance.amount': () => faker.finance.amount().toString(),
  'finance.transactionType': () => faker.finance.transactionType(),

  // Image module
  'image.avatar': () => faker.image.avatar(),
  'image.url': () => faker.image.url(),
  'image.dataUri': () => faker.image.dataUri(),

  // Music module
  'music.songName': () => faker.music.songName(),
  'music.artist': () => faker.music.artist(),
  'music.album': () => faker.music.album(),
  'music.genre': () => faker.music.genre(),

  // Vehicle module
  'vehicle.vehicle': () => faker.vehicle.vehicle(),
  'vehicle.manufacturer': () => faker.vehicle.manufacturer(),
  'vehicle.model': () => faker.vehicle.model(),
  'vehicle.type': () => faker.vehicle.type(),
  'vehicle.fuel': () => faker.vehicle.fuel(),
  'vehicle.color': () => faker.vehicle.color(),
  'vehicle.vin': () => faker.vehicle.vin(),

  // Company module
  'company.name': () => faker.company.name(),
  'company.buzzNoun': () => faker.company.buzzNoun(),
  'company.buzzVerb': () => faker.company.buzzVerb(),
  'company.buzzAdjective': () => faker.company.buzzAdjective(),
  'company.catchPhrase': () => faker.company.catchPhrase(),

  // Science module
  'science.chemicalElement': () => faker.science.chemicalElement().symbol,
  'science.unit': () => faker.science.unit(),
};

const knownFieldsToFaker: Record<string, string> = {
  name: 'name',
  firstName: 'firstName',
  lastName: 'lastName',
  fullName: 'name',
  email: 'email',
  phone: 'phone',
  telephone: 'phone',
  mobile: 'phone',
  id: 'uuid',
  uuid: 'uuid',
  uuidv4: 'uuid',
  address: 'street',
  street: 'street',
  city: 'city',
  country: 'country',
  url: 'url',
  website: 'url',
  avatar: 'avatar',
  image: 'avatar',
  photo: 'avatar',
  company: 'company',
  organization: 'company',
  description: 'sentence',
  bio: 'paragraph',
  text: 'paragraph',
  content: 'paragraph',
  age: 'number',
  count: 'number',
  quantity: 'number',
  price: 'number',
  amount: 'number',
  total: 'number',
  isActive: 'boolean',
  active: 'boolean',
  enabled: 'boolean',
  verified: 'boolean',
  createdAt: 'date',
  updatedAt: 'date',
  deletedAt: 'date',
  timestamp: 'date',
  username: 'internet.username',
  password: 'internet.password',
  domain: 'internet.domainName',
  ip: 'internet.ip',
  ipv4: 'internet.ipv4',
  ipv6: 'internet.ipv6',
  jobTitle: 'person.jobTitle',
  job: 'person.jobTitle',
  gender: 'person.gender',
  sex: 'person.sex',
  prefix: 'person.prefix',
  suffix: 'person.suffix',
  zipCode: 'location.zipCode',
  zip: 'location.zipCode',
  latitude: 'location.latitude',
  longitude: 'location.longitude',
  state: 'location.state',
  userAgent: 'internet.userAgent',
  mac: 'internet.mac',
  httpMethod: 'internet.httpMethod',
  httpStatusCode: 'internet.httpStatusCode',
  productName: 'commerce.productName',
  department: 'commerce.department',
  currency: 'finance.currencyCode',
  iban: 'finance.iban',
  bitcoin: 'finance.bitcoinAddress',
  song: 'music.songName',
  artist: 'music.artist',
  album: 'music.album',
  genre: 'music.genre',
  vehicle: 'vehicle.vehicle',
  manufacturer: 'vehicle.manufacturer',
  model: 'vehicle.model',
  color: 'vehicle.color',
  licensePlate: 'vehicle.licensePlate',
};

export function parseKeyWithType(key: string): { name: string; type: string } {
  const match = key.match(/^(\w+):([\w.]+)$/);
  if (match) {
    return { name: match[1], type: match[2] };
  }
  return { name: key, type: 'string' };
}

export function getFakerForKey(key: string, explicitType?: string): FakerMethod {
  if (explicitType && explicitType in fakerFunctions) {
    return explicitType as FakerMethod;
  }
  
  const lowerKey = key.toLowerCase();
  if (lowerKey in knownFieldsToFaker) {
    return knownFieldsToFaker[lowerKey] as FakerMethod;
  }
  
  return 'word';
}

export function processFakerTemplate(template: string): string {
  // First, handle nested format: {{faker.object.method}}
  const patternNested = /\{\{faker\.(\w+)\.(\w+)\}\}/g;
  let result = template.replace(patternNested, (_match, obj: string, method: string) => {
    const key = `${obj}.${method}`;
    if (key in fakerFunctions) {
      const value = fakerFunctions[key]();
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    return _match;
  });

  // Then handle simple format: {{faker.method}}
  const patternSimple = /\{\{faker\.(\w+)\}\}/g;
  return result.replace(patternSimple, (_match, method: string) => {
    if (method in fakerFunctions) {
      const value = fakerFunctions[method]();
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    return _match;
  });
}

export function processObject(obj: any): any {
  if (typeof obj === 'string') {
    return processFakerTemplate(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const processed: any = {};
    for (const key in obj) {
      processed[key] = processObject(obj[key]);
    }
    return processed;
  }
  
  return obj;
}

export function generateFakerValue(method: FakerMethod): any {
  return fakerFunctions[method]?.() || faker.lorem.word();
}

export function generateFromKeysWithTypes(keys: string[], count: number = 1): object[] {
  const results: object[] = [];
  
  for (let i = 0; i < count; i++) {
    const row: Record<string, unknown> = {};
    for (const key of keys) {
      const { name, type } = parseKeyWithType(key);
      const fakerMethod = getFakerForKey(name, type);
      row[name] = generateFakerValue(fakerMethod);
    }
    results.push(row);
  }
  
  return results;
}

export const availableFakerMethods = Object.keys(fakerFunctions) as FakerMethod[];
