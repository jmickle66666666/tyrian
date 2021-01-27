Math.lerp = function(a, b, t)
{
    return a + ((b - a) * t);
}

Math.clamp = function(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

Math.sign = function(value)
{
    if (value == 0) return 0;
    if (value > 0) return 1;
    return -1;
}

Math.choice = function(array)
{
    return array[Math.floor(Math.random() * array.length)];
}
