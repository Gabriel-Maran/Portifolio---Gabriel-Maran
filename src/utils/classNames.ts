/** Junta classes CSS e ignora as vazias, como em cx(styles.link, isActive && styles.active). */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
