export function zipVariadic<T extends readonly unknown[][]>(
  ...arrays: T
): unknown[][] {
  const minLength = Math.min(...arrays.map((arr) => arr.length))
  return Array.from({ length: minLength }, (_, i) =>
    arrays.map((arr) => arr[i])
  )
}
