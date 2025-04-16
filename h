[33mcommit a46589e2e2fcad5a77d2b74726e91b26f560f924[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmaster[m[33m)[m
Author: Lasse Nielsen <lasse@xerrion.dk>
Date:   Wed Apr 16 19:30:44 2025 +0200

    fix: improve handling of usableFraction display and fix ChargingTimeCalculator issues

 .../components/calculators/BaseCalculator.svelte   | 134 [32m++++++++++[m[31m------[m
 .../frequency/FrequencyCalculator.svelte           |  12 [32m+[m[31m-[m
 src/lib/components/layout/CalculatorLayout.svelte  |   4 [32m+[m[31m-[m
 src/lib/components/ui/ParameterForm.svelte         | 172 [32m++++++++++[m[31m-----------[m
 src/lib/components/ui/ResultCard.svelte            |  20 [32m++[m[31m-[m
 src/lib/components/ui/StatsGroup.svelte            |  17 [32m+[m[31m-[m
 src/lib/components/ui/Tips.svelte                  |  42 [32m+++[m[31m--[m
 src/lib/components/ui/input/CheckboxInput.svelte   |  48 [32m++++++[m
 src/lib/components/ui/input/NumberInput.svelte     | 139 [32m+++++++++++++++++[m
 src/lib/components/ui/input/RadioInput.svelte      |  65 [32m++++++++[m
 src/lib/components/ui/input/RangeInput.svelte      | 166 [32m++++++++++++++++++++[m
 src/lib/components/ui/input/SelectInput.svelte     |  46 [32m++++++[m
 src/lib/components/ui/input/TextInput.svelte       | 105 [32m+++++++++++++[m
 src/lib/types/calculator.ts                        |   4 [32m+[m[31m-[m
 src/lib/types/index.ts                             |   1 [32m+[m
 src/lib/types/input.ts                             |  86 [32m+++++++++++[m
 src/lib/utils/constants.ts                         |   2 [32m+[m[31m-[m
 src/lib/utils/formatters.ts                        |   6 [32m+[m[31m-[m
 src/lib/utils/formatting.ts                        |   0
 src/lib/utils/storage.ts                           |  41 [31m-----[m
 src/lib/utils/validation.ts                        |  32 [31m----[m
 src/routes/ev-calculator/+page.svelte              |   8 [32m+[m[31m-[m
 22 files changed, 867 insertions(+), 283 deletions(-)
