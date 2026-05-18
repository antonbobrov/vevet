type TNumber = { type: 'num'; min?: number; max?: number };

type TString = { type: 'str'; options?: string[] };

type TInstance = { type: 'instance'; instances: any[] };

type TBool = { type: 'bool' };

type TElement = { type: 'element' };

type THTMLElement = { type: 'htmlelement' };

type TWindow = { type: 'window' };

type TFunc = { type: 'func' };

type TTypes =
  | TBool
  | TNumber
  | TString
  | TInstance
  | TElement
  | THTMLElement
  | TWindow
  | TFunc;

function testNumber(val: any, rule: TNumber) {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    return false;
  }

  if (typeof rule.min !== 'undefined') {
    return val >= rule.min;
  }

  if (typeof rule.max !== 'undefined') {
    return val <= rule.max;
  }

  return true;
}

function testString(val: any, rule: TString) {
  if (typeof val !== 'string') {
    return false;
  }

  if (rule.options) {
    return rule.options.includes(val);
  }

  return true;
}

function testInstance(val: any, rule: TInstance) {
  const isValid = rule.instances.some((inst) => val instanceof inst);

  return isValid;
}

function testBool(val: any) {
  return typeof val === 'boolean';
}

function testElement(val: any) {
  return val instanceof Element;
}

function testHTMLElement(val: any) {
  return val instanceof HTMLElement;
}

function testWindow(val: any) {
  return val instanceof Window;
}

function testFunc(val: any) {
  return typeof val === 'function';
}

export function testProps<T>(
  that: any,
  source: Record<keyof T, any>,
  rulesObject: Partial<Record<keyof T, TTypes[]>>,
) {
  const sourceKeys = Object.keys(source) as (keyof T)[];

  sourceKeys.forEach((sourceKey) => {
    if (sourceKey === '__staticProp' || sourceKey === '__mutableProp') {
      return;
    }

    if (!rulesObject[sourceKey] || rulesObject[sourceKey].length === 0) {
      console.warn('No rules for', sourceKey, 'in ', that);

      return;
    }

    const rules = rulesObject[sourceKey];
    const val = source[sourceKey];

    const isValid = rules.some((rule) => {
      if (rule.type === 'bool') {
        return testBool(val);
      }

      if (rule.type === 'num') {
        return testNumber(val, rule);
      }

      if (rule.type === 'str') {
        return testString(val, rule);
      }

      if (rule.type === 'instance') {
        return testInstance(val, rule);
      }

      if (rule.type === 'element') {
        return testElement(val);
      }

      if (rule.type === 'htmlelement') {
        return testHTMLElement(val);
      }

      if (rule.type === 'window') {
        return testWindow(val);
      }

      if (rule.type === 'func') {
        return testFunc(val);
      }

      return true;
    });

    if (!isValid) {
      console.error(
        sourceKey,
        'is invalid and does not pass the test',
        rules,
        'in',
        that,
      );
    }
  });
}

export function describeProps<T extends Record<string, any>>(
  arg: Partial<Record<keyof T, TTypes[]>>,
) {
  return {
    rules: arg,
    test: (that: any, obj: T) => testProps(that, obj, arg),
  };
}
