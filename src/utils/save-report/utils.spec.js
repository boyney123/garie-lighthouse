const path = require("path");
const { generatePath, parseTagsIntoFolderStructure } = require("./utils");

describe("save-report", () => {
  describe("utils", () => {
    it("should generate path from tags sorted alphabetically", () => {
      const tags = {
        technology: "angular",
        cookie: "coolCookie"
      };

      expect(parseTagsIntoFolderStructure(tags)).toEqual([
        "cookie__coolCookie",
        "technology__angular"
      ]);
      expect(parseTagsIntoFolderStructure(undefined)).toBeUndefined();
    });

    it("should generate path without tags", () => {
      const mockUrl = "http://10.206.139.30/hodinky/jacqueslemans-1-1824c";
      const recordRootDir = path.join(__dirname, "../../../reports");
      const timestamp = new Date().toISOString()
      
      const expectedResult = `${recordRootDir}/10.206.139.30/hodinky/jacqueslemans-1-1824c/cookie__coolCookie/technology__angular/${timestamp}.html`;

      const tags = {
        technology: "angular",
        cookie: "coolCookie"
      };
      const result = generatePath(recordRootDir, mockUrl, tags, timestamp);
      expect(result).toEqual(expectedResult);
    });

    it("should generate path without tags", () => {
      const mockUrl = "http://10.206.139.30/hodinky/jacqueslemans-1-1824c";
      const recordRootDir = path.join(__dirname, "../../../reports");
      const timestamp = new Date().toISOString()
      
      const result = generatePath(recordRootDir, mockUrl);
      expect(result).toContain("10.206.139.30/hodinky/jacqueslemans-1-1824c")
    });
  });
});