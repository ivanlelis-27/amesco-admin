export interface PromoValidationResult {
    errors: { [key: string]: string };
    invalidFields: string[];
}

export function validatePromoFields(
    brandItemName: string,
    price: string | number | null,
    unit: string,
    selectedImage: File | null
): PromoValidationResult {
    const errors: { [key: string]: string } = {};
    const invalidFields: string[] = [];

    // Required fields
    if (!brandItemName || brandItemName.trim() === '') {
        errors['brandItemName'] = 'Brand/Item Name is required.';
        invalidFields.push('brandItemName');
    }
    if (!price || price.toString().trim() === '') {
        errors['price'] = 'Price is required.';
        invalidFields.push('price');
    }
    if (!unit || unit.trim() === '') {
        errors['unit'] = 'Unit is required.';
        invalidFields.push('unit');
    }
    if (!selectedImage) {
        errors['selectedImage'] = 'Image is required.';
        invalidFields.push('selectedImage');
    }

    // Price must be a valid number
    if (price && (typeof price === 'string' ? isNaN(Number(price)) : isNaN(price))) {
        errors['price'] = 'Price must be a valid number.';
        if (!invalidFields.includes('price')) invalidFields.push('price');
    }

    return { errors, invalidFields };
}