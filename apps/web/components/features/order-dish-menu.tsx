"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import { FOOD_PROVIDER_IDS, providerName, providerSearchUrl } from "@forgefit/domain";
import { Button, Menu, MenuContent, MenuItem, MenuTrigger } from "@forgefit/ui";

/** "Don't want to cook it?" Links to the dish on food delivery apps' own search. */
export function OrderDishMenu({ dish }: { dish: string }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="secondary">
          Order this dish
          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        {FOOD_PROVIDER_IDS.map((provider) => (
          <MenuItem key={provider} asChild>
            <a href={providerSearchUrl(provider, dish)} target="_blank" rel="noopener noreferrer">
              Search on {providerName(provider)}
              <ExternalLink className="ml-auto size-3.5 text-muted" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
