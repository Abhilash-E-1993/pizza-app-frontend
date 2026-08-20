// Small shared display helpers — keep formatting consistent across pages.

/** ₹1,299 style formatting (Indian locale). */
export function formatPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
}

/**
 * Rewrites a Cloudinary URL to an auto-optimized thumbnail and upgrades
 * legacy http:// URLs to https:// (old DB records may still hold http).
 */
export function getOptimizedImage(url, width = 500) {
    if (!url || typeof url !== "string") return "";
    let out = url.replace("http://res.cloudinary.com", "https://res.cloudinary.com");
    if (out.includes("/upload/") && !out.includes("/upload/f_auto")) {
        out = out.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }
    return out;
}

/**
 * Order status display map.
 * NOTE: "DELIVERD" is a known backend typo kept for DB compatibility —
 * always display it as "Delivered".
 */
export const ORDER_STATUS = {
    ORDERED: { label: "Ordered", classes: "bg-blue-50 text-blue-600 border-blue-100" },
    PROCESSING: { label: "Processing", classes: "bg-amber-50 text-amber-600 border-amber-100" },
    OUT_OF_DELIVERY: { label: "Out for delivery", classes: "bg-violet-50 text-violet-600 border-violet-100" },
    DELIVERD: { label: "Delivered", classes: "bg-green-50 text-green-600 border-green-100" },
    CANCELLED: { label: "Cancelled", classes: "bg-red-50 text-red-500 border-red-100" },
};

export function getOrderStatus(status) {
    return ORDER_STATUS[status] || { label: status || "Unknown", classes: "bg-gray-50 text-gray-500 border-gray-100" };
}

export function formatDate(iso) {
    try {
        return new Date(iso).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
}

export function formatPaymentMethod(method) {
    return method === "ONLINE" ? "Online payment" : "Cash on delivery";
}