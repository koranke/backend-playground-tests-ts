export abstract class ScenarioCore {
    protected needsDefaultValuesPopulated: boolean = true

    protected getNonNull<T>(itemDefault: T | null, itemOptional: T | null): T | null {
        return itemDefault !== null ? itemDefault : itemOptional
    }

    protected getNonNullWithSupplier<T>(itemDefault: T | null, supplier: (() => T) | null): T | null {
        if (itemDefault !== null) {
            return itemDefault
        } else {
            if (supplier === null) {
                return null
            }
            return supplier()
        }
    }
}