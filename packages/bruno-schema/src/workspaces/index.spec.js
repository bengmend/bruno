const { expect } = require("@jest/globals");
const { uuid, validationErrorWithMessages } = require("../utils/testUtils");
const randomstring = require("randomstring");
const { workspaceSchema } = require("./index");

describe("Workspace Schema Validation", () => {
  it("workspace schema must validate successfully", async () => {
    const workspace = {
      uid: uuid(),
      name: "My workspace",
    };

    const isValid = await workspaceSchema.validate(workspace);
    expect(isValid).toBeTruthy();
  });

  it("workspace schema must throw error upon invalid uuid length", async () => {
    const workspace = {
      uid: uuid() + "junk",
      name: "My workspace",
    };

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("uid must be 21 characters in length"))]);
  });

  it("workspace schema must throw error upon invalid uuid character", async () => {
    const workspace = {
      uid: uuid(),
      name: "My workspace",
    };

    workspace.uid = "$" + workspace.uid.substring(1, workspace.uid.length);

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("uid must be alphanumeric"))]);
  });

  it("workspace schema must throw error when name is empty", async () => {
    const workspace = {
      uid: uuid(),
    };

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("name is required"))]);
  });

  it("workspace schema must throw error when name has more than 50 characters", async () => {
    const workspace = {
      uid: uuid(),
      name: randomstring.generate({
        length: 51,
        charset: "alphabetic",
      }),
    };

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("name must be 50 characters or less"))]);
  });

  it("workspace schema must throw error when unknown key is present", async () => {
    const workspace = {
      uid: uuid(),
      name: "My Workspace",
      foo: "bar",
    };

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("this field has unspecified keys: foo"))]);
  });

  it("workspace schema must validate successfully with collections", async () => {
    const workspace = {
      uid: uuid(),
      name: "My workspace",
      collections: [{ uid: uuid() }],
    };

    const isValid = await workspaceSchema.validate(workspace);
    expect(isValid).toBeTruthy();
  });

  it("workspace schema throw an error when collections has an unknown property", async () => {
    const workspace = {
      uid: uuid(),
      name: "My workspace",
      collections: [{ uid: uuid(), foo: "bar" }],
    };

    return Promise.all([expect(workspaceSchema.validate(workspace)).rejects.toEqual(validationErrorWithMessages("collections[0] field has unspecified keys: foo"))]);
  });
});
