<script setup>
import config from '../../site.config.ts';

const year = new Date().getFullYear();
const since = config.SITE_SINCE;
const copyrightDate = parseInt(since) < year ? `${since}~${year}` : year;
</script>

<template>
    <div className="relative bg-neutral-950 py-8 text-sm font-medium text-gray-200 text-center border-t border-t-[rgb(46_50_64/0.45)]">
        © {{ copyrightDate }} • {{ config.SITE_AUTHOR }}
    </div>
</template>
