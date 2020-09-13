import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';

interface Props {
    penalty?: number;
    judgment?: number;
}

export function penaltyStr(penalty: number, [t, i18n]: UseTranslationResponse) {
    const penaltyTemplate = t(`intl.number.penalty`, { returnObjects: true }) as object;
    return Intl.NumberFormat(i18n.language, penaltyTemplate).format(penalty);
}

export function judgmentStr(judgment: number, [t]: UseTranslationResponse) {
    return judgment + t(`intl.number.judgment.unit`);
}

export function penaltyJudgmentStr(props: Props, translationResponse: UseTranslationResponse) {
    let res = '';
    res += props.penalty ? penaltyStr(props.penalty || 0, translationResponse) : '';
    res += props.penalty && props.judgment ? ' | ' : '';
    res += props.judgment
        ? props.judgment + translationResponse[0](`intl.number.judgment.unit`)
        : '';
    return res;
}

function PenaltyJudgment(props: Props) {
    return <span>{penaltyJudgmentStr(props, useTranslation('lang'))}</span>;
}

export default PenaltyJudgment;
