
export class RecognizeSelfieAndIDDocumentResponse {
    /**
   * True if the two faces belong to the same person or the face belongs to the person, otherwise
   * false.
   */
    isIdentical: boolean;
    /**
     * A number indicates the similarity confidence of whether two faces belong to the same person,
     * or whether the face belongs to the person. By default, isIdentical is set to True if
     * similarity confidence is greater than or equal to 0.5. This is useful for advanced users to
     * override "isIdentical" and fine-tune the result on their own data.
     */
    confidence: number;
}