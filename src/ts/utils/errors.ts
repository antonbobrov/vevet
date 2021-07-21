export const vevetAppErrorText = `Vevet.Application does not exist yet. 
Call "new Vevet.Application()" before using all the stuff`;

export function throwVevetAppError () {
    throw new Error(vevetAppErrorText);
}
