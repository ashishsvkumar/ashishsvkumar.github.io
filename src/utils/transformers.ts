import { ItemPreviewProps } from "../components/item/ItemPreview";
import { RedMartItem } from "../store/package/types";

export function itemDetailsToItemPreviewProps(item: RedMartItem): ItemPreviewProps {
    return {
        sku: item.skuId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        selectedQuantity: 1,
        selectedIssue: undefined
    }
}

export function blobToFile(theBlob: Blob, fileName: string): File {
    var blob: any = theBlob;
    blob.lastModifiedDate = new Date();
    blob.name = fileName;

    //Cast to a File() type
    return <File>blob;
}
